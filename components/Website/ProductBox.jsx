import Image from 'next/image'
import React from 'react'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import Link from 'next/link'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'

const ProductBox = ({ product }) => {
  return (
    <div className='rounded-lg overflow-hidden hover:shadow-lg'>

        <Link href={WEBSITE_ROUTE.PRODUCT_DETAILS(product.slug)}>
          <Image src={product?.media[0]?.secure_url || imgPlaceholder.src} width={400} height={400} 
            alt={product?.media[0]?.alt || product?.name}
            title={product?.media[0]?.title || product?.name}
            className=' w-full lg:h-[300px] md:h-[200px] object-cover object-top'
          />
          <div className=' border-t p-3'>
              <h4>{product?.name}</h4>
              <p className=' flex gap-2 text-sm mt-2'>
                  <span className=' line-through text-gray-400'>{product?.mrp.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span>
                  <span className=' font-semibold'>{product?.sellingPrice.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span>
              </p>
          </div>
        
        </Link>

    </div>
  )
}

export default ProductBox