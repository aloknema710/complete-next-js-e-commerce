'use client'
import Filter from '@/components/Website/Filter'
import Shorting from '@/components/Website/Shorting'
import WebsiteBreadCrumb from '@/components/Website/WebsiteBreadCrumb'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import useWindowSize from '@/hooks/useWindowSize'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import ProductBox from '@/components/Website/ProductBox'
import ButtonLoading from '@/components/Application/ButtonLoading'

const breadcrumb = {
  title: 'Shop',
  links: [
    {label: 'Shop', href: WEBSITE_ROUTE.SHOP}
  ]
}
const Shop = () => {
    const searchParams = useSearchParams().toString()
    const [limit, setLimit] = useState(9)
    const [sorting, setSorting] = useState('default_sorting')
    const [isMobileFilter, setIsMobileFilter] = useState(false)
    const windowSize = useWindowSize()

    const fetchProducts = async(pageParam)=>{
      const {data: getProduct} = await axios.get(`/api/shop/?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`)
      console.log(getProduct)

      if(!getProduct.success) return

      return getProduct.data
    }

    // fetchProducts(0)

    const {error, data, isFetching, fetchNextPage, hasNextPage} = useInfiniteQuery({
      queryKey:['products',limit, sorting, searchParams],
      queryFn: async({pageParam})=>await fetchProducts(pageParam),
      initialPageParam: 0,
      getNextPageParam:(lastPage)=>{
        return lastPage.nextPage
      }
    })
    console.log(data)

  return (
    <div>
        <WebsiteBreadCrumb props={breadcrumb}/>
        <section className=' lg:flex lg:px-32 px-4 my-20'>
          {windowSize.width > 1024 ? 
            <div className=' w-72 me-4'>
                <div className='sticky top-0 bg-gray-300 rounded p-5'>
                    <Filter/>
                </div>
            </div>
          :
            <Sheet  open={isMobileFilter} onOpenChange={()=>setIsMobileFilter(false)}>
              <SheetContent side='left' className={'block'}>
                <SheetHeader className={'border-b'}>
                  <SheetTitle>Filter</SheetTitle>
                  <SheetDescription>
                      
                  </SheetDescription>
                </SheetHeader>

                <div className=' p-4 overflow-auto h-[calc(100vh-80px)]'>
                          <Filter/>
                </div>
              </SheetContent>
            </Sheet>
          }
            

            

            <div className='lg:w-[calc(100%-18rem)]'>
              <Shorting limit={limit} setLimit={setLimit} sorting={sorting} setSorting={setSorting} mobileFilterOpen={isMobileFilter} setMobileFilterOpen={setIsMobileFilter}/>
              {isFetching && <div className='p-3 font-semibold text-center'>Loading...</div>}
              {error && <div className='p-3 font-semibold text-center'>{error.message}</div>}

              <div className='grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 mt-10'>
                  {data && data.pages.map(page=>(
                      page.products.map(product=>(
                        <ProductBox key={product._id} product={product}/>
                      ))
                  ))}
              </div>


              <div className=' flex justify-center mt-10'>
                  {hasNextPage ?
                    <ButtonLoading type="button" loading={isFetching} text={'Load More'} onClick={fetchNextPage}/>:
                    <>
                      {!isFetching && <span>No more data to load</span>}
                    </>
                  }
              </div>
            </div>
        </section>
    </div>
  )
}

export default Shop