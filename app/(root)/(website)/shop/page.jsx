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
            </div>
        </section>
    </div>
  )
}

export default Shop