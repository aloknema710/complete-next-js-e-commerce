'use client'
import BreadCrumbs from '@/components/Admin/BreadCrumb'
import Media from '@/components/Admin/Media'
import UploadMedia from '@/components/Admin/UploadMedia'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useDeleteMutation from '@/hooks/useDeleteMutation'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home'},
    { href: '', label: 'Media'}
]

const MediaPage = () => {
    const [deleteType, setDeleteType] = useState('SD')
    const [selectedMedia, setSelectedMedia] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const searchParams = useSearchParams()
    
    useEffect(()=>{
      if(searchParams){
        const trashOf = searchParams.get('trashof')
        setSelectedMedia([])
        if(trashOf){
          setDeleteType('PD')
        }
        else{
          setDeleteType('SD')
        }
      }
    },[searchParams])
    
    const fetchMedia = async({ pageParam = 0 }) => {
        console.log('📡 Fetching page:', pageParam);
        const { data: response } = await axios.get(`/api/media?page=${pageParam}&&limit=10&&deleteType=${deleteType}`)
        console.log('✅ Full API response:', response);
        
        // Return whatever your API actually returns
        return response.data;
    }

    const {
      data,
      error,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      status,
    } = useInfiniteQuery({
      queryKey: ['media-data', deleteType],
      queryFn: fetchMedia,
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        console.log('🔍 getNextPageParam - lastPage:', lastPage);
        
        if (!lastPage) return undefined;
        
        // Handle different response structures
        const hasMore = lastPage.hasMore !== undefined ? lastPage.hasMore : true;
        
        return hasMore ? allPages.length : undefined;
      },
    })

    // Safe data extraction
    const allMedia = React.useMemo(() => {
      console.log('📊 Full data:', data);
      
      if (!data?.pages) return [];
      
      return data.pages.flatMap(page => {
        console.log('📄 Processing page:', page);
        
        // Try different possible structures
        if (page?.mediaData) return page.mediaData;
        if (Array.isArray(page)) return page;
        if (page?.data && Array.isArray(page.data)) return page.data;
        
        return [];
      });
    }, [data]);

    console.log('🎨 All media to render:', allMedia);

    const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')

    const handleDelete = (ids, deleteType) =>{
      let c = true
      if(deleteType === 'PD'){
        c = confirm('Are you sure you want to delete the data permanently')
      }
      if(c){
        deleteMutation.mutate({ids, deleteType})
      }
      setSelectAll(false)
      setSelectedMedia([])
    }

    const handleSelectAll = () =>{
      setSelectAll(!selectAll)
    }

    useEffect(()=>{
      if(selectAll){
        const ids = data.pages.flatMap(page => page.mediaData.map(media =>media._id))
        setSelectedMedia(ids)
      }else{
        setSelectedMedia([])
      }
    },[selectAll])

  return (
      <div>
        <BreadCrumbs breadcrumbData={breadcrumbData}/>
        <Card className='py-0 rounded shadow-sm'>
           <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
              <div className=' flex justify-between items-center'>
                  <h4 className=' font-semibold uppercase text-xl'>
                      {deleteType === 'SD' ? 'Media' : 'Media Trash'}
                  </h4>
                  <div className='flex items-center gap-5'>
                      {deleteType === 'SD' &&
                      <UploadMedia/>}
                      <div className=' flex gap-3'>
                          {deleteType === 'SD' 
                                ?
                              <Button type='button' variant='destructive'>
                                <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>Trash</Link>
                              </Button>
                                :
                              <Button type='button' >
                                <Link href={`${ADMIN_MEDIA_SHOW}`}>Back to Media</Link>
                              </Button>   
                          }
                      </div>
                  </div>
              </div>
           </CardHeader>
           <CardContent>

                {selectedMedia.length > 0
                    &&
                    <div className=' py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center'>
                        <Label>
                          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} className={'border-primary'}/> Select All
                        </Label>

                        <div>
                          {deleteType === 'SD'
                              ?
                            <Button variant='destructive' className={'cursor-pointer'} onClick={() => handleDelete(selectedMedia, deleteType)}>
                                Move into trash
                            </Button>
                            :
                            <>
                                <Button className='bg-green-500 hover:bg-green-600' onClick={() => handleDelete(selectedMedia, "RSD")}>
                                    Restore
                                </Button>

                                <Button variant='destructive' onClick={() => handleDelete(selectedMedia, deleteType)}>
                                    Delete Permanantly
                                </Button>
                            </>
                          }
                        </div>
                    </div>
                }

                {status === 'pending' ? (
                    <div>Loading...</div>
                ) : status === 'error' ? (
                    <div className=' text-red-500 text-sm'>{error.message}</div>
                ) : (
                    <>
                        {data.pages.flatMap(page=>page.mediaData.map(media => media._id)).length === 0 &&
                        <div className='text-center'>Media not found</div>}

                        <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-3 gap-4 mb-5">
                            {data?.pages?.map((page, index) =>(
                              <React.Fragment key={index}>
                                  {
                                    page?.mediaData?.map((media) => (
                                      <Media key={media._id} media={media} handleDelete={handleDelete} 
                                      deleteType={deleteType} selectedMedia={selectedMedia} setSelectedMedia={setSelectedMedia}/>
                                    ))
                                  }
                              </React.Fragment>
                            ))}
                            {/* {allMedia.map(media => (
                                <div key={media._id} className="border rounded p-2">
                                    <img 
                                        src={media.secure_url} 
                                        alt={media.public_id}
                                        className="w-full h-32 object-cover"
                                    />
                                    <p className="text-sm truncate">{media.public_id}</p>
                                </div>
                            ))} */}
                        </div>

                        {hasNextPage && (
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
                            </button>
                        )}
                    </>
                )}
           </CardContent>
        </Card>
      </div>
  )
}

export default MediaPage




// 'use client'
// import BreadCrumbs from '@/components/Admin/BreadCrumb'
// import UploadMedia from '@/components/Admin/UploadMedia'
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
// import { useInfiniteQuery } from '@tanstack/react-query'
// import axios from 'axios'
// import React, { useState } from 'react'

// const breadcrumbData = [
//     { href: ADMIN_DASHBOARD, label: 'Home'},
//     { href: '', label: 'Media'}
// ]

// const MediaPage = () => {
//     const [deleteType, setDeleteType] = useState('SD')

//     const fetchMedia = async(page = 0, deleteType) =>{
//         const {data: response} = await axios.get(`/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`)
//         console.log('Fetched page:', page, 'Data:', response);
//         return {
//           mediaData: response.data.mediaData || response.data, // Handle both structures
//           hasMore: response.data.hasMore || false,
//           nextCursor: page + 1, // Use page number as cursor
//           currentPage: page
//         };
//     }


//     const {
//       data,
//       error,
//       fetchNextPage,
//       fetchPreviousPage,
//       hasNextPage,
//       hasPreviousPage,
//       isFetchingNextPage,
//       isFetchingPreviousPage,
//       promise,
//       status,
//       ...result
//     } = useInfiniteQuery({
//       queryKey: ['media-data', deleteType],
//       queryFn: fetchMedia,//(pageParam, deleteType),  //async({ pageParam = 0}) => await
//       initialPageParam: 0,
//       getNextPageParam: (lastPage, pages, lastPageParam, allPageParams) =>{
//         const nextPage = pages.length
//         console.log('lastPage:', lastPage);
//         return lastPage.hasMore ? nextPage :undefined
//       },
//     })

//     console.log(data)

//   return (
//       <div>
//         <BreadCrumbs breadcrumbData={breadcrumbData}/>
//         <Card className='py-0 rounded shadow-sm'>
//            <CardHeader className='pt-3 px-3 border-b [.border-b]:pb-2'>
//               <div className=' flex justify-between items-center'>
//                   <h4 className=' font-semibold uppercase text-xl'>Media</h4>
//                   <div className='flex items-center gap-5'>
//                       <UploadMedia/>
//                   </div>
//               </div>
//            </CardHeader>
//            <CardContent>
//                 {status === 'pending'
//                     ?
//                     <div>Loading...</div>
//                     :
//                     status === 'error' ?
//                         <div className=' text-red-500 text-sm'>{error.message}</div>
//                           :
//                         <></>
//                 }
//            </CardContent>
//         </Card>
//       </div>
//   )
// }

// export default MediaPage