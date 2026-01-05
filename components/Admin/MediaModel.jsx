import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Loading from '@/public/assets/images/loading.svg'
import axios from 'axios'
import ModalMediaBlock from './ModalMediaBlock'
import { showToast } from '@/lib/showToast'
import ButtonLoading from '../Application/ButtonLoading'

const MediaModel = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }) => {
    console.log('🎯 MediaModel rendered, open:', open)
    
    const [previouslySelected, setPreviouslySelected] = useState([])

    const fetchMedia = async(page) => {
        console.log('🔄 Fetching page:', page)
        const { data: response } = await axios.get(`/api/media?page=${page}&limit=18&deleteType=SD`)
        console.log('✅ Response received:', response)
        return response
    }

    const {isPending, isError, error, data, isFetching, fetchNextPage, hasNextPage} = useInfiniteQuery({
        queryKey: ['MediaModel'],
        queryFn: async({ pageParam = 0 }) => await fetchMedia(pageParam),
        placeholderData: keepPreviousData,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            // Use the correct path to hasMore
            return lastPage?.data?.hasMore ? lastPage.data.currentPage + 1 : undefined
        },
        // enabled: open
    })

    console.log('📊 Query State:', { isPending, isError, data })

    // Extract media data safely
    const allMedia = React.useMemo(() => {
        if (!data?.pages) return []
        
        const media = []
        data.pages.forEach(page => {
            if (page?.data?.mediaData) {
                media.push(...page.data.mediaData)
            }
        })
        console.log('📸 Extracted media:', media)
        return media
    }, [data])

    console.log('🎯 All media count:', allMedia.length)

    const handleClear = () => {
        setSelectedMedia([]) // Clear all selected media
        setPreviouslySelected([])
        showToast('success','Media Selection Cleared')
    }
    const handleClose = () => {
        setSelectedMedia(previouslySelected) 
        setOpen(false)
    }
    const handleSelect = () => {
        // setOpen(false)
        if(selectedMedia.length <= 0) return showToast('error', 'Please select at least one media item.')
        setPreviouslySelected(selectedMedia)
        setOpen(false)
    }

    // const handleMediaClick = (media) => {
    //     if (isMultiple) {
    //         const isSelected = selectedMedia.some(item => item._id === media._id)
    //         if (isSelected) {
    //             setSelectedMedia(prev => prev.filter(item => item._id !== media._id))
    //         } else {
    //             setSelectedMedia(prev => [...prev, media])
    //         }
    //     } else {
    //         setSelectedMedia([media])
    //     }
    // }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}
                className='sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none'
            >
                <DialogDescription className='hidden'></DialogDescription>

                <div className='h-[90vh] bg-white dark:bg-card p-3 rounded shadow'>
                    <DialogHeader className='h-8 border-b'>
                        <DialogTitle className={'font-bold text-2xl text-gray-800'}>Media Selection</DialogTitle>
                    </DialogHeader>

                    <div className='h-[calc(100%-80px)] overflow-auto py-2'>
                        {/* DEBUG INFO */}
                        {/* <div className="p-4 bg-gray-100 mb-4 rounded">
                            <h3 className="font-bold mb-2">Debug Info:</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>isPending: <span className={isPending ? "text-red-500" : "text-green-500"}>{isPending ? "YES" : "NO"}</span></div>
                                <div>isError: <span className={isError ? "text-red-500" : "text-green-500"}>{isError ? "YES" : "NO"}</span></div>
                                <div>Data exists: <span className={data ? "text-green-500" : "text-red-500"}>{data ? "YES" : "NO"}</span></div>
                                <div>Pages count: <span className="text-blue-500">{data?.pages?.length || 0}</span></div>
                                <div>Media items: <span className="text-blue-500">{allMedia.length}</span></div>
                            </div>
                        </div> */}

                        {isPending && (
                            <div className='flex justify-center items-center flex-col py-8'>
                                <Image src={Loading} alt='loading' height={80} width={80}/>
                                <p className="mt-2">Loading media...</p>
                            </div>
                        )}

                        {isError && (
                            <div className='flex justify-center items-center py-8'>
                                <span className='text-red-500'>Error: {error?.message}</span>
                            </div>
                        )}

                        {/* SIMPLE DISPLAY - This should definitely work */}
                        {!isPending && allMedia.length > 0 && (
                            <>
                                {/* <h1 className="font-bold mb-4 text-black text-xl">Media Items ({allMedia.length}):</h1> */}
                                <div className='grid lg:grid-cols-6 grid-cols-3 gap-2'>
                                    {allMedia.map((media) => (
                                        <ModalMediaBlock
                                                    key={media._id}
                                                    media={media}
                                                    selectedMedia={selectedMedia}
                                                    setSelectedMedia={setSelectedMedia || []}
                                                    isMultiple={isMultiple}
                                                />    
                                    ))}
                                </div>
                                {hasNextPage ?
                                    <div className=' flex justify-center py-5'>
                                        <ButtonLoading type='button' onClick={()=>fetchNextPage()} loading={isFetching} text={'Load More'}/>
                                    </div>
                                    :
                                    <p className=' text-center py-5'>Nothing more to load</p>
                                }
                            </>
                        )}

                        {!isPending && allMedia.length === 0 && !isError && (
                            <div className="text-center py-8">
                                <div className="text-yellow-500 text-lg mb-2">No media found</div>
                                <div className="text-gray-500 text-sm">
                                    Check if your API is returning data in the expected format
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='h-10 pt-3 border-t flex justify-between'>
                        <div>
                            <Button type='button' variant='destructive' onClick={handleClear}>
                                Clear All
                            </Button>
                        </div>
                        <div className='flex gap-5'>
                            <Button type='button' variant='destructive' onClick={handleClose}>
                                Close
                            </Button>
                            <Button type='button' onClick={handleSelect}>
                                Select {/*({selectedMedia.length})*/}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MediaModel


// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import React from 'react'
// import { Button } from '../ui/button'
// import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
// import Image from 'next/image'
// import Loading from '@/public/assets/images/loading.svg'
// import axios from 'axios'

// const MediaModel = ( { open, setOpen, selectedMedia, setSelectedMedia, isMultiple}) => {
//     const fetchMedia = async(page)=>{
//         const{data: response} = await axios.get(`/api/media?page=${page}&&limit=18&&deleteType=SD`)
//         console.log(response)
//         return response
//     }
//     const {isPending, isError, error, data, isFetching, fetchNextPage, hasNextPage} = useInfiniteQuery({
//         queryKey: ['MediaModel'],
//         queryFn: async({ pageParam }) => await fetchMedia(pageParam),
//         placeholderData: keepPreviousData,
//         initialPageParam:0,
//         getNextPageParam: (lastPage) => {
//             // Use the correct property from your API response
//             return lastPage.data?.hasMore ? lastPage.data.currentPage + 1 : undefined
//         }
//         // getNextPageParam:(lastPage, allPages)=>{
//         //     const nextPage = allPages.length
//         //     return lastPage.hasMore?nextPage:undefined
//         // }
//     })

//     if (isPending) {
//         return (
//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent className='sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none'>
//                     <div className='h-[90vh] bg-white p-3 rounded shadow flex items-center justify-center'>
//                         <div className='text-center'>
//                             <Image src={Loading} alt='loading' height={80} width={80}/>
//                             <p>Loading media...</p>
//                         </div>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         )
//     }

//     const handleClear = () =>{

//     }
//     const handleClose = () =>{

//     }
//     const handleSelect = () =>{

//     }
//   return (
//     <Dialog 
//         open={open}
//         openChange={() => setOpen(!open)}
//     >
//         <DialogContent onInteractOutside={(e) => e.preventDefault()}
//             className='sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none'
//         >
//             <DialogDescription className='hidden'></DialogDescription>

//             <div className=' h-[90vh] bg-white p-3 rounded shadow'>
//                 <DialogHeader className={'h-8 border-b'}>
//                     <DialogTitle>Media Selection</DialogTitle>
//                 </DialogHeader>

//                 <div className='h-[calc(100%-80px)] overflow-auto py-2'>
//                     {isPending ?
//                         (<div className='size-full flex justify-center items-center'>
//                             <Image src={Loading} alt='loading' height={80} width={80}/>
//                         </div>)
//                         :
//                         isError?
//                             <div className='size-full flex justify-center items-center'>
//                                 <span className='text-red-500'>{error.message}</span>
//                             </div>
//                             :
//                             <>
//                                 <div className='grid lg:grid-cols-6 grid-cols-3 gap-2'>
//                                     {data?.pages?.map((page, pageIndex) => (
//                                         <React.Fragment key={pageIndex}>
//                                             {page?.data?.mediaData?.map((media) => (
//                                                 <div key={media._id} className='p-2 border'>
//                                                     {/* Display the _id here */}
//                                                      <span>{media._id}</span>
//                                                 </div>
//                                             ))}
//                                          </React.Fragment>
//                                     ))}
//                                 </div>

//                                 {/* <div className='grid lg:grid-cols-6 grid-cols-3 gap-2'>
//                                     {data?.pages?.map((page, index) =>(
//                                         <React.Fragment key={index}>
//                                         {
//                                             page?.mediaData?.map((media) => (
//                                                 <span key={media._id}>{media._id}</span>
//                                             ))
//                                         }
//                                     </React.Fragment>
//                                     ))}
//                                 </div> */}
//                             </>
//                     }
//                 </div>

//                 <div className=' h-10 pt-3 border-t flex justify-between'>
//                     <div>
//                         <Button type='button' variant='destructive' onClick={handleClear}>
//                             Clear All
//                         </Button>
//                     </div>
//                     <div className=' flex gap-5'>
//                         <Button type='button' variant='destructive' onClick={handleClose}>
//                             Close
//                         </Button>
//                         <Button type='button' onClick={handleSelect}>
//                             Select
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </DialogContent>

//     </Dialog>
//   )
// }

// export default MediaModel