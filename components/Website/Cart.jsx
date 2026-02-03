  import React, { useEffect, useState } from 'react'
  import { BsCart2 } from 'react-icons/bs'
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { useDispatch, useSelector } from 'react-redux'
  // import { store } from '@/store/store'
  import Image from 'next/image'
  import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
  import { removeFromCart } from '@/store/reducer/cartReducer'
  import { Button } from '../ui/button'
  import Link from 'next/link'
  import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
  import { showToast } from '@/lib/showToast'

  const Cart = () => {
    const [open, setOpen] = useState(false)
    const [subTotal, setSubTotal] = useState(0)
    const [discount, setDiscount] = useState(0)
    const cart = useSelector(store=>store.cartStore)
    const dispatch = useDispatch()

    useEffect(()=>{
      const cartProducts = cart.products
      const totalAmount = cartProducts.reduce((sum, product)=>sum + (product.sellingPrice * product.qty),0)
      const discount = cartProducts.reduce((sum, product)=>sum + (product.mrp - product.sellingPrice) * product.qty,0)
      setSubTotal(totalAmount)
      setDiscount(discount)
    },[cart])

    // console.log("cart",cart)
    return (
      <Sheet className="relative" open={open} onOpenChange={setOpen}>

      <SheetTrigger asChild>
  <div className="relative cursor-pointer">
    <BsCart2 size={25} className="text-gray-500 hover:text-primary" />
    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center">
      {cart.count}
    </span>
  </div>
</SheetTrigger>


      {/* <SheetTrigger>
          <BsCart2 size={25} className='text-gray-500 hover:text-primary'/>
          <span className='absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1'>{cart.count}</span>
      </SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='text-2xl'>My Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className='h-[calc(100vh - 40px)] pb-10 pt-2'>
            <div className='h-[calc(100% - 120px)] overflow-auto px-2'>
                {cart.products.length === 0 && <div className='h-full flex justify-center items-center text-xl font-semibold'>
                      Your Cart is Empty
                  </div>}
                {cart.products?.map(product=>(
                    <div key={product.variantId} className='flex justify-between items-center gap-5 mb-4 border-b pb-4'>
                        <div className='flex gap-5 items-center'>
                          <Image src={product?.media||imgPlaceholder} height={100} width={100} alt={product.name} className='w-20 h-20 rounded border'/>
                          <div>
                              <h4 className='text-lg mb-1'>{product.name}</h4>
                              <p className='text-gray-500'>{product.size}/{product.color}</p>
                          </div>
                        </div>
                        <div>
                          <button type='button' className='text-red-500 underline underline-offset-1 mb-2 cursor-pointer'
                              onClick={()=>dispatch(removeFromCart({productId: product.productId, variantId: product.variantId}))}>
                              Remove
                          </button>
                          <p className='font-semibold'>{product.qty}X{product.sellingPrice.toLocaleString('en-IN',{style:'currency', currency:'INR'})}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='h-32 border-t pt-5 px-2'>
                <h2 className='flex justify-between items-center text-lg font-semibold'><span>Subtotal</span> <span>{subTotal.toLocaleString('en-IN',{style: 'currency',currency: 'INR'})}</span></h2>
                <h2 className='flex justify-between items-center text-lg font-semibold'><span>Discount</span> <span>{discount.toLocaleString('en-IN',{style: 'currency',currency: 'INR'})}</span></h2>

                <div className='flex justify-between gap-10'>
                    <Button type='button' asChild variant="secondary" className={'w-1/2'} onClick={()=>setOpen(false)}>
                        <Link href={WEBSITE_ROUTE.CART}>View Cart</Link>
                    </Button>
                    <Button type='button' asChild variant="secondary" className={'w-1/2'} onClick={()=>setOpen(false)}>
                        {cart.count ? <Link href={WEBSITE_ROUTE.CHECKOUT}>Checkout</Link>
                          :
                          <button type='button' onClick={()=>showToast('error','your cart is empty')}></button>  
                        }
                    </Button>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
    )
  }

  export default Cart