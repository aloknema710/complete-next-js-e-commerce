//   import React, { useEffect, useState } from 'react'
//   import { BsCart2 } from 'react-icons/bs'
//   import {
//     Sheet,
//     SheetClose,
//     SheetContent,
//     SheetDescription,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
//   } from "@/components/ui/sheet"
//   import { useDispatch, useSelector } from 'react-redux'
//   // import { store } from '@/store/store'
//   import Image from 'next/image'
//   import imgPlaceholder from '@/public/assets/images/img-placeholder.webp'
//   import { removeFromCart } from '@/store/reducer/cartReducer'
//   import { Button } from '../ui/button'
//   import Link from 'next/link'
//   import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute'
//   import { showToast } from '@/lib/showToast'

//   const Cart = () => {
//     const [open, setOpen] = useState(false)
//     const [subTotal, setSubTotal] = useState(0)
//     const [discount, setDiscount] = useState(0)
//     const cart = useSelector(store=>store.cartStore)
//     const dispatch = useDispatch()

//     // useEffect(()=>{
//     //   const cartProducts = cart.products
//     //   const totalAmount = cartProducts.reduce((sum, product)=>sum + (product.sellingPrice * product.qty),0)
//     //   const discount = cartProducts.reduce((sum, product)=>sum + (product.mrp - product.sellingPrice) * product.qty,0)
//     //   setSubTotal(totalAmount)
//     //   setDiscount(discount)
//     // },[cart])

//   useEffect(() => {
//   const cartProducts = cart.products ?? []
//   const totalAmount = cartProducts.reduce(
//     (sum, product) => sum + product.sellingPrice * product.qty,
//     0
//   )
//   const discount = cartProducts.reduce(
//     (sum, product) =>
//       sum + (product.mrp - product.sellingPrice) * product.qty,
//     0
//   )

//   setSubTotal(totalAmount)
//   setDiscount(discount)
// }, [cart])


//     console.log("cart",cart)
//     return (
//       <Sheet className="relative" open={open} onOpenChange={setOpen}>

//       <SheetTrigger asChild>
//   <div className="relative cursor-pointer">
//     <BsCart2 size={25} className="text-gray-500 hover:text-primary" />
//     <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center">
//       {cart.count}
//     </span>
//   </div>
// </SheetTrigger>


//       {/* <SheetTrigger>
//           <BsCart2 size={25} className='text-gray-500 hover:text-primary'/>
//           <span className='absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1'>{cart.count}</span>
//       </SheetTrigger> */}
//       <SheetContent className={"sm:max-w-[450px] w-full"}>
//         <SheetHeader className={"py-2"}>
//           <SheetTitle className='text-2xl'>My Cart</SheetTitle>
//           <SheetDescription></SheetDescription>
//         </SheetHeader>
//         <div className='h-[calc(100vh - 40px)] pb-10 pt-2'>
//             <div className='h-[calc(100% - 120px)] overflow-y-auto px-2'>
//                 {cart.products?.length === 0 && <div className='h-full flex justify-center items-center text-xl font-semibold'>
//                       Your Cart is Empty
//                   </div>}
//                 {cart.products?.map(product=>(
//                     <div key={product.variantId} className='flex justify-between items-center gap-5 mb-4 border-b pb-4'>
//                         <div className='flex gap-5 items-center'>
//                           <Image src={product?.media||imgPlaceholder} height={100} width={100} alt={product.name} className='w-20 h-20 rounded border'/>
//                           <div>
//                               <h4 className='text-lg mb-1'>{product.name}</h4>
//                               <p className='text-gray-500'>{product.size}/{product.color}</p>
//                           </div>
//                         </div>
//                         <div>
//                           <button type='button' className='text-red-500 underline underline-offset-1 mb-2 cursor-pointer'
//                               onClick={()=>dispatch(removeFromCart({productId: product.productId, variantId: product.variantId}))}>
//                               Remove
//                           </button>
//                           <p className='font-semibold'>{product.qty}X{product.sellingPrice.toLocaleString('en-IN',{style:'currency', currency:'INR'})}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <div className='h-32 border-t pt-5 px-2'>
//                 <h2 className='flex justify-between items-center text-lg font-semibold'><span>Subtotal</span> <span>{subTotal.toLocaleString('en-IN',{style: 'currency',currency: 'INR'})}</span></h2>
//                 <h2 className='flex justify-between items-center text-lg font-semibold'><span>Discount</span> <span>{discount.toLocaleString('en-IN',{style: 'currency',currency: 'INR'})}</span></h2>

//                 <div className='flex justify-between gap-10'>
//                     <Button type='button' asChild variant="secondary" className={'w-1/2'} onClick={()=>setOpen(false)}>
//                         <Link href={WEBSITE_ROUTE.CART}>View Cart</Link>
//                     </Button>
//                     <Button type='button' asChild variant="secondary" className={'w-1/2'} onClick={()=>setOpen(false)}>
//                         {cart.count ? <Link href={WEBSITE_ROUTE.CHECKOUT}>Checkout</Link>
//                           :
//                           <button type='button' onClick={()=>showToast('error','your cart is empty')}></button>  
//                         }
//                     </Button>
//                 </div>
//             </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//     )
//   }

//   export default Cart



import React, { useEffect, useState } from 'react'
import { BsCart2 } from 'react-icons/bs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useDispatch, useSelector } from 'react-redux'
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
  const cart = useSelector(store => store.cartStore)
  const dispatch = useDispatch()

  useEffect(() => {
    const cartProducts = cart.products ?? []
    const totalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty, 0
    )
    const discount = cartProducts.reduce(
      (sum, product) => sum + (product.mrp - product.sellingPrice) * product.qty, 0
    )
    setSubTotal(totalAmount)
    setDiscount(discount)
  }, [cart])

  return (
    <Sheet open={open} onOpenChange={setOpen}>

      {/* Trigger */}
      <SheetTrigger asChild>
        <div className="relative cursor-pointer">
          <BsCart2 size={25} className="text-gray-500 hover:text-primary transition-colors" />
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center">
            {cart.count}
          </span>
        </div>
      </SheetTrigger>

      {/* Panel */}
      <SheetContent className="sm:max-w-[450px] w-full flex flex-col p-0">

        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-semibold">My Cart</SheetTitle>
            <span className="text-sm text-gray-400">{cart.count ?? 0} items</span>
          </div>
          <SheetDescription />
        </SheetHeader>

        {/* Scrollable product list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 min-h-0">
          {cart.products?.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center gap-2 text-gray-400">
              <BsCart2 size={48} className="text-gray-200" />
              <p className="text-lg font-semibold text-gray-500">Your Cart is Empty</p>
              <p className="text-sm">Add items to get started</p>
            </div>
          )}

          {cart.products?.map(product => (
            <div key={product.variantId} className="flex items-center gap-4 py-4 border-b last:border-b-0">

              {/* Image */}
              <Image
                src={product?.media || imgPlaceholder}
                height={100}
                width={100}
                alt={product.name}
                className="w-20 h-20 rounded-lg border object-cover flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h4>
                <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">{product.size} · {product.color}</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">
                  {product.qty} × {product.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </p>
                {product.mrp > product.sellingPrice && (
                  <p className="text-xs text-green-500 mt-0.5">
                    You save {(product.mrp - product.sellingPrice).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </p>
                )}
              </div>

              {/* Remove */}
              <button
                type="button"
                className="text-xs text-red-400 hover:text-red-600 underline underline-offset-2 flex-shrink-0 transition-colors"
                onClick={() => dispatch(removeFromCart({ productId: product.productId, variantId: product.variantId }))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary & Actions — always visible at bottom */}
        {cart.products?.length > 0 && (
          <div className="border-t bg-gray-50 px-5 pt-4 pb-6 flex-shrink-0">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
              <span>Subtotal</span>
              <span>{subTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-green-500 mb-3">
              <span>Discount</span>
              <span>− {discount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>
            <div className="flex justify-between items-center text-base font-semibold text-gray-800 mb-4 pt-3 border-t">
              <span>Total</span>
              <span>{(subTotal - discount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                asChild
                variant="outline"
                className="w-1/2"
                onClick={() => setOpen(false)}
              >
                <Link href={WEBSITE_ROUTE.CART}>View Cart</Link>
              </Button>

              <Button
                type="button"
                asChild
                className="w-1/2"
                onClick={() => setOpen(false)}
              >
                {cart.count
                  ? <Link href={WEBSITE_ROUTE.CHECKOUT}>Checkout</Link>
                  : <button type="button" onClick={() => showToast('error', 'Your cart is empty')}>Checkout</button>
                }
              </Button>
            </div>
          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}

export default Cart