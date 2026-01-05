import Filter from '@/components/Website/Filter'
import WebsiteBreadCrumb from '@/components/Website/WebsiteBreadCrumb'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
import React from 'react'

const breadcrumb = {
  title: 'Shop',
  links: [
    {label: 'Shop', href: WEBSITE_ROUTE.SHOP}
  ]
}
const Shop = () => {
  return (
    <div>
        <WebsiteBreadCrumb props={breadcrumb}/>
        <section className=' lg:flex lg:px-32 px-4 my-20'>
            <div className=' w-72 me-4'>
                <div className='sticky top-0 bg-gray-300 rounded p-5'>
                    <Filter/>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Shop