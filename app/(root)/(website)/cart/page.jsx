'use client'
import { Button } from '@/components/ui/button'
import WebsiteBreadCrumb from '@/components/Website/WebsiteBreadCrumb'
import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
import { HiMinus, HiPlus } from 'react-icons/hi2'
import { removeFromCart } from '@/store/reducer/cartReducer'
import { IoCloseCircleOutline } from 'react-icons/io5'

const breadCrumb = {
    title: 'Cart',
    links: [
      {label: "Cart"}
    ]
}

const CartPage = () => {
    // const cart = useSelector(store=>store.CartStore)
    const dispatch = useDispatch()
    const cart = useSelector(store=>store.cartStore)
    // console.log('cart',cart)
    const [qty, setQty] = useState(1)
    const handleQty = (actionType)=>{
    if(actionType==='inc') setQty(prev=>prev+1)
    else{
      if(qty!==1) setQty(prev=>prev-1)
    }  
  }
  return (
    <div>
        <WebsiteBreadCrumb props={breadCrumb}/>
        {cart.count === 0
          ?
          <div className='w-screen h-[500px] flex justify-center items-center py-32'>
              <div className='text-center'>
                  <h4 className='text-4xl font-semibold mb-5'>Your Cart is empty!</h4>
                  <Button type="button" asChild>
                      <Link href={WEBSITE_ROUTE.SHOP}>Continue Shopping</Link>
                  </Button>
              </div>
          </div>
          :
          <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
              <div className='lg:w-[70%] w-full'>
                  <table className='w-full border'>
                    <thead className='border-b bg-gray-50 md:table-header-group hidden'>
                      <tr>
                          <th className='text-start p-3'>Product</th>
                          <th className='text-start p-3'>Price</th>
                          <th className='text-start p-3'>Quantity</th>
                          <th className='text-start p-3'>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                        {cart.products.map(product=>(
                            <tr key={product.variantId} className='md:table-row block border-b'>
                                <td className='p-3'>
                                    <div className='flex items-center gap-5'>
                                        <Image src={product.media||imgPlaceholder} alt={product.name} width={60} height={60} />
                                        <div>
                                            <h4 className='text-lg font-medium line-clamp-1'>
                                                <Link href={WEBSITE_ROUTE.PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                                            </h4>
                                                <p>Color:{product.color}</p>
                                                <p>Size:{product.size}</p>
                                        </div>
                                    </div>
                                </td>

                                <td className='md:table-cell flex justify-between md:p-3 px-2 pb-2 text-center'>
                                    <span className='md:hidden font-medium'>Price</span>
                                    <span>
                                        {product.sellingPrice.toLocaleString('en-IN',{style:'currency',currency:'INR'})}
                                    </span>
                                </td>

                                <td className='md:table-cell flex justify-between md:p-3 px-2 pb-2'>
                                    <span className='md:hidden font-medium'>Quantity</span>

                                    <div className='flex justify-center'>

                                            <div className=' flex items-center justify-center h-10 border rounded-full'>
                                                            <button type='button' className='h-full w-10 flex justify-center items-center' onClick={()=>handleQty('dec')}>
                                                                <HiMinus className=' cursor-pointer'/>
                                                            </button>
                                                            <input type="text" value={qty} className=' w-14 text-center border-none outline-offset-0' readOnly/>
                                                            <button type='button' className='h-full w-10 flex justify-center items-center' onClick={()=>handleQty('inc')}>
                                                                <HiPlus className=' cursor-pointer'/>
                                                            </button>
                                    
                                            </div>

                                    </div>
                                </td>

                                <td className='md:table-cell flex md:p-3 px-3 pb-2 text-center'>
                                    <span className='md:hidden font-medium'>Remove</span>
                                    <button type='button' onClick={()=>dispatch(removeFromCart({productId: product.productId, variantId:product.variantId}))} className='text-red-500'><IoCloseCircleOutline/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
              </div>
          </div>
        }
    </div>
  )
}

export default CartPage