"use client";

import ButtonLoading from "@/components/Application/ButtonLoading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import loading from '@/public/assets/images/loading.svg'

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import WebsiteBreadCrumb from "@/components/Website/WebsiteBreadCrumb";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { zSchema } from "@/lib/zodSchema";
import { WEBSITE_ROUTE } from "@/routes/WebsiteRoute";
import { clearCart } from "@/store/reducer/cartReducer";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
// import Razorpay from "razorpay";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaShippingFast } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import z from "zod";

const breadCrumb = {
  title: "Checkout",
  links: [{ label: "Checkout" }],
};

const Checkout = () => {
  const router = useRouter()
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const auth = useSelector((store) => store.authStore);
  console.log('Auth in checkout page:', auth)

  const [savingOrder,setSavingOrder]= useState(false)
  const [verifiedCartData, setVerifiedCartData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  /* ---------------- CART VERIFICATION ---------------- */

  const { data: getVerifiedCartData } = useFetch(
    "/api/cart-verification",
    "POST",
    { data: cart.products },
  );
  // console.log('id',process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  useEffect(() => {
    if (getVerifiedCartData?.success) {
      setVerifiedCartData(getVerifiedCartData.data);
    }
  }, [getVerifiedCartData]);

  /* ---------------- TOTAL CALCULATION ---------------- */

  useEffect(() => {
    const subTotalAmount = cart.products.reduce(
      (sum, p) => sum + p.sellingPrice * p.qty,
      0,
    );

    const discountAmount = cart.products.reduce(
      (sum, p) => sum + (p.mrp - p.sellingPrice) * p.qty,
      0,
    );

    setSubtotal(subTotalAmount);
    setDiscount(discountAmount);
    setTotalAmount(subTotalAmount);

    couponForm.setValue("minShoppingAmount", subTotalAmount);
  }, [cart.products]);

  /* ---------------- COUPON FORM ---------------- */

  const couponSchema = zSchema.pick({
    couponCode: true,
    minShoppingAmount: true,
  });

  const couponForm = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      couponCode: "",
      minShoppingAmount: 0,
    },
  });


  const applyCoupon = async (values) => {
  setCouponLoading(true);

  try {
    const { data } = await axios.post("/api/coupon/apply", {
      code: values.couponCode, // 🔥 FIXED: send as `code`
      minShoppingAmount: values.minShoppingAmount,
    });

    if (!data.success) throw new Error(data.message);

    const discountValue =
      (subtotal * data.data.discountPercentage) / 100;

    setCouponDiscountAmount(discountValue);
    setTotalAmount(subtotal - discountValue);
    setCouponCode(values.couponCode);
    setIsCouponApplied(true);

    showToast("success", data.message);
  } catch (error) {
    showToast("error", error.response?.data?.message || error.message);
  } finally {
    setCouponLoading(false);
  }
};

  // const applyCoupon = async (values) => {
  //   setCouponLoading(true);
  //   try {
  //     const { data } = await axios.post("/api/coupon/apply", values);
  //     if (!data.success) throw new Error(data.message);

  //     const discountValue = (subtotal * data.data.discountPercentage) / 100;

  //     setCouponDiscountAmount(discountValue);
  //     setTotalAmount(subtotal - discountValue);
  //     setCouponCode(values.couponCode);
  //     setIsCouponApplied(true);

  //     showToast("success", data.message);
  //   } catch (error) {
  //     showToast("error", error.message);
  //   } finally {
  //     setCouponLoading(false);
  //   }
  // };

  const removeCoupon = () => {
    setIsCouponApplied(false);
    setCouponCode("");
    setCouponDiscountAmount(0);
    setTotalAmount(subtotal);
  };

  /* ---------------- ORDER FORM ---------------- */

  const orderFormSchema = zSchema
    .pick({
      name: true,
      email: true,
      phone: true,
      country: true,
      state: true,
      city: true,
      pincode: true,
      landmark: true,
      ordernote: true,
    })
    .extend({
      userId: z.string().optional(),
    });

  const orderForm = useForm({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      landmark: "",
      ordernote: "",
      userId: auth?.data?.user?.id ?? "",
      // ...(auth?._id ? { userId: auth._id } : {}) // Only include userId if it exists
    },
  });

  // get order id for payment
  const getOrderId = async (amount) => {
    try {
      const { data: orderIdData } = await axios.post(
        "/api/payment/get-order-id",
        { amount },
      );
      if (!orderIdData.success) throw new Error(orderIdData.message);

      return { success: true, order_id: orderIdData.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const placeOrder = async (formData) => {
    setPlacingOrder(true);
    try {
      // console.log('ORDER DATA:', formData)
      // const generateOrderId = await getOrderId(totalAmount);
      const generateOrderId = await getOrderId(Math.round(totalAmount));

      // console.log(generateOrderId);
      if(!generateOrderId.success) throw new Error(generateOrderId.message)
        const order_id = generateOrderId.order_id
        

      const razOption = {
        "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Replace with your Razorpay key_id
        // "amount": totalAmount * 100, // Amount is in currency subunits.
        "amount": Math.round(totalAmount),

        "currency": 'INR',
        "name": 'E Store',
        "description": 'Payment for your order',
        "image": 'https://res.cloudinary.com/ds4z15u3g/image/upload/v1771165262/logo-black_s9mifm.png',
        "order_id": order_id, // This is the order_id created in the backend
        "callback_url": 'http://localhost:3000/payment-success', // Your success URL
        "handler": async function(response) {
          setSavingOrder(true)
            const products = verifiedCartData.map((cartItem)=>({
              productId: cartItem.productId,
              variantId: cartItem.variantId,
              name: cartItem.name,
              qty: cartItem.qty,
              mrp: cartItem.mrp,
              sellingPrice: cartItem.sellingPrice,
              // totalAmount: totalAmount
            }))

            const {data: paymentResponseData} = await axios.post('/api/payment/save-order',{
              // razorpay_payment_id: response.razorpay_payment_id,
              ...formData, ...response, products: products, subtotal: subtotal, discount: discount, couponDiscountAmount: couponDiscountAmount, totalAmount: totalAmount
            })

            if(paymentResponseData.success){
              showToast('success', paymentResponseData.message)
              dispatch(clearCart())
              orderForm.reset()
              router.push(WEBSITE_ROUTE.ORDER_DETAILS(response.razorpay_order_id))
              setSavingOrder(false)
            }else{
              
              showToast('error', paymentResponseData.message)
              setSavingOrder(false)
            }
        },
        "prefill": {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        "theme": {
          color: '#7c3aed'
        },
      };

      // const rzp = new Razorpay(razOption);

      if (!window.Razorpay) {
  showToast("error", "Razorpay SDK failed to load.");
  return;
}

const rzp = new window.Razorpay(razOption);

      rzp.on('payment.failed', function (response){
        showToast('error', response.error.description );
      });
      rzp.open()
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setPlacingOrder(false);
    }
  };



  /* ---------------- UI ---------------- */

  return (
    <div>

      {savingOrder &&
        <div className="h-screen w-screen fixed top-0 left-0 z-50 bg-black/10">
                    <div className="h-screen flex justify-center items-center">

                    <Image src={loading} height={80} width={80} alt='loading'/>
                    <h4 className="font-semibold">Order Confirming</h4>

                    </div>
        </div>
      }

      <WebsiteBreadCrumb props={breadCrumb} />

      {cart.count === 0 ? (
        <div className="w-screen h-[500px] flex justify-center items-center">
          <div className="text-center">
            <h4 className="text-4xl font-semibold mb-5">Your Cart is Empty!</h4>
            <Button>
              <Link href={WEBSITE_ROUTE.SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap lg:flex-nowrap gap-10 my-20 px-4 lg:px-32">
          {/* ---------------- SHIPPING FORM ---------------- */}
          <div className="lg:w-[60%] w-full">
            <div className="flex items-center gap-2 font-semibold">
              <FaShippingFast size={25} /> Shipping Address
            </div>

            <Form {...orderForm}>
              <form
                className="grid grid-cols-2 gap-5 mt-5"
                onSubmit={orderForm.handleSubmit(placeOrder)}
              >
                {[
                  "name",
                  "email",
                  "phone",
                  "country",
                  "state",
                  "city",
                  "pincode",
                  "landmark",
                ].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={orderForm.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Enter ${fieldName}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <div className="col-span-2">
                  <FormField
                    control={orderForm.control}
                    name="ordernote"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter Order Note" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <ButtonLoading
                  type="submit"
                  text="Place Order"
                  loading={placingOrder}
                  className="bg-black rounded-full px-5"
                />
              </form>
            </Form>
          </div>

          {/* ---------------- ORDER SUMMARY ---------------- */}
          <div className="lg:w-[40%] w-full sticky top-5">
            <div className="rounded bg-gray-50 p-5">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>

              {/* Products List */}
              <div className="space-y-4 mb-5">
                {verifiedCartData?.map((product) => (
                  <div
                    key={product.variantId}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.media}
                        width={60}
                        height={60}
                        alt={product.name}
                        className="rounded"
                      />

                      <div>
                        <p className="font-medium line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.qty} × ₹{product.sellingPrice}
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold">
                      ₹
                      {(product.qty * product.sellingPrice).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {subtotal.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    -{" "}
                    {discount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Coupon Discount</span>
                  <span className="text-green-600">
                    -{" "}
                    {couponDiscountAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>

                <div className="flex justify-between font-semibold text-lg border-t pt-3">
                  <span>Total</span>
                  <span>
                    {totalAmount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </span>
                </div>
              </div>

              {/* Coupon */}
              {!isCouponApplied ? (
                <Form {...couponForm}>
                  <form
                    className="flex gap-3"
                    onSubmit={couponForm.handleSubmit(applyCoupon)}
                  >
                    <FormField
                      control={couponForm.control}
                      name="couponCode"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} placeholder="Enter Coupon Code" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ButtonLoading
                      type="submit"
                      text="Apply"
                      loading={couponLoading}
                    />
                  </form>
                </Form>
              ) : (
                <div className="flex justify-between bg-gray-200 px-4 py-2 rounded">
                  <div>
                    <span className="text-xs">Coupon</span>
                    <p className="font-semibold">{couponCode}</p>
                  </div>
                  <button onClick={removeCoupon}>
                    <IoCloseCircleSharp size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/*<Script src="https://checkout.razorpay.com/v1/checkout.js"/>*/}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        // strategy="lazyOnload"
      />

    </div>
  );
};

export default Checkout;

// 'use client'
// import ButtonLoading from '@/components/Application/ButtonLoading';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import WebsiteBreadCrumb from '@/components/Website/WebsiteBreadCrumb';
// import useFetch from '@/hooks/useFetch';
// import { showToast } from '@/lib/showToast';
// import { zSchema } from '@/lib/zodSchema';
// import { WEBSITE_ROUTE } from '@/routes/WebsiteRoute';
// import { addInToCart, clearCart } from '@/store/reducer/cartReducer';
// import { zodResolver } from '@hookform/resolvers/zod';
// import axios from 'axios';
// import Image from 'next/image';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form';
// import { FaShippingFast } from 'react-icons/fa';
// import { IoCloseCircleSharp } from 'react-icons/io5';
// import { useDispatch, useSelector } from 'react-redux';
// import z from 'zod/v3';

// const breadCrumb = {
//   title: "Checkout",
//   links: [{ label: "Checkout" }],
// };
// const Checkout = () => {
//     const dispatch = useDispatch()
//     const cart = useSelector(store => store.cartStore)
//     const auth = useSelector(store => store.authStore)

//     const [verifiedCartData, setVerifiedCartData] = useState([])
//     const [isCouponApplied, setIsCouponApplied] = useState(false)
//     const [subtotal, setSubtotal] = useState(0)
//     const [discount, setDiscount] = useState(0)
//     const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)
//     const [totalAmount, setTotalAmount] = useState(0)
//     const [couponLoading, setCouponLoading] = useState(false)
//     const [couponCode, setCouponCode] = useState('')
//     const [placingOrder, setPlacingOrder] = useState(false)

//     const{data: getVerifiedCartData} = useFetch('/api/cart-verification','POST',{data:cart.products})
//     console.log('getvercardata',getVerifiedCartData)

//     useEffect(() => {
//       if(getVerifiedCartData && getVerifiedCartData.success){
//         const cartData = getVerifiedCartData.data
//         setVerifiedCartData(cartData)
//         console.log('settedcartdata',cartData)
//         // dispatch(clearCart())

//         // cartData.forEach(cartItem => {
//         //   dispatch(addInToCart(cartItem))
//         // });
//       }

//     }, [getVerifiedCartData])

//     useEffect(()=>{
//           const cartProducts = cart.products
//           const subTotalAmount = cartProducts.reduce((sum, product)=>sum + (product.sellingPrice * product.qty),0)
//           const discount = cartProducts.reduce((sum, product)=>sum + (product.mrp - product.sellingPrice) * product.qty,0)
//           setSubtotal(subTotalAmount)
//           setDiscount(discount)
//           setTotalAmount(subTotalAmount)

//           couponForm.setValue('minShoppingAmount', subTotalAmount)
//         },[cart])

//     const couponSchema = zSchema.pick({
//       code: true,
//       minShoppingAmount: true
//     })

//     const couponForm = useForm({
//       resolver: zodResolver(couponSchema),
//       defaultValues:{
//         code: "",
//         minShoppingAmount: subtotal
//       }
//     })

//     const applyCoupon = async(values) =>{
//       setCouponLoading(true)
//       try {
//         const {data: response} = await axios.post('/api/coupon/apply', values)
//         if(!response.success) throw new Error(response.message)
//         const discountPercentage = response.data.discountPercentage
//         setCouponDiscountAmount((subtotal * discountPercentage)/100)
//         setTotalAmount(subtotal - ((subtotal*discountPercentage)/100))
//         showToast('success', response.message)
//         setCouponCode(couponForm.getValues('code'))
//         setIsCouponApplied(true)
//       } catch (error) {
//         showToast('error', error.message)
//       }finally{
//         setCouponLoading(false)
//       }
//     }

//     const removeCoupon = () =>{
//       setIsCouponApplied(false)
//       setCouponCode('')
//       setCouponDiscountAmount(0)
//       setTotalAmount(subtotal)
//     }

//     const orderFormSchema = zSchema.pick({
//       name: true,
//       email: true,
//       phone: true,
//       country: true,
//       state: true,
//       city: true,
//       pincode: true,
//       landmark: true,
//       ordernote: true
//     }).extend({
//       userId: z.string().optional()
//     })

//     const orderForm = useForm({
//       resolver: zodResolver(orderFormSchema),
//       defaultValues:{
//         name: '',
//         email:'',
//         phone:'',
//         country:'',
//         state:'',
//         city:'',
//         pincode:'',
//         landmark:'',
//         ordernote:'',
//         userId: auth?._id,
//       }
//     })

//     const placeOrder = async(FormData) =>{
//         console.log(FormData)
//         setPlacingOrder(true)
//         try {

//         } catch (error) {
//           console.log(error)
//           showToast('error', error.message)
//         } finally{
//           setPlacingOrder(false)
//         }
//     }

//     console.log(orderForm.formState.errors)

//   return (
//     <div>
//       <WebsiteBreadCrumb props={breadCrumb} />
//       {cart.count === 0
//         ?
//         <div className='w-screen h-[500px] flex justify-center items-center py-32'>
//             <div className='text-center'>
//                 <h4 className='text-4xl font-semibold mb-5'>Your Cart is Empty!</h4>
//                 <Button>
//                   <Link href={WEBSITE_ROUTE.SHOP}>Continue Shopping</Link>
//                 </Button>
//             </div>
//         </div>
//         :
//         <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>

//           <div className="lg:w-[60%] w-full">
//                       <div className='flex font-semibold gap-2 items-center'>
//                                   <FaShippingFast size={25}/> Shipping Address:
//                      </div>

//                       <div className='mt-5'>

//                              <Form {...orderForm}>
//                                 <form className='grid grid-cols-2 gap-5' onSubmit={orderForm.handleSubmit(placeOrder)}>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={orderForm.control} name='name'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input placeholder='Enter your name' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={orderForm.control} name='email'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input type="email" placeholder='Enter your email' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={orderForm.control} name='phone'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input placeholder='Enter your phone' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={orderForm.control} name='country'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input placeholder='Enter your Country' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={orderForm.control} name='state'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input placeholder='Enter your State' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={orderForm.control} name='city'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input placeholder='Enter your City' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={orderForm.control} name='pincode'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input placeholder='Enter your Pincode' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={orderForm.control} name='landmark'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input placeholder='Enter your Landmark' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>
//                                     <div className='mb-3 col-span-2'>
//                                         <FormField control={orderForm.control} name='ordernote'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 {/* <Input placeholder='Enter your Landmark' {...field}/> */}
//                                                   <Textarea placeholder='Enter Order Note' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>

//                                     <div className='mb-3'>
//                                         <ButtonLoading type="submit" text="Place Order" loading={placingOrder} className={"bg-black rounded-full cursor-pointer px-5"}/>
//                                     </div>
//                                 </form>
//                             </Form>
//                       </div>
//           </div>

//           <div className="lg:w-[70%] w-full">
//             <div className="rounded bg-gray-50 p-5 sticky top-5">
//                 <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
//                 <div>
//                     <table className='w-full border'>
//                         <tbody>
//                             {verifiedCartData && verifiedCartData?.map(product => (
//                               <tr key={product.variantId}>
//                                   <td className='p-3'>
//                                       <div className='flex items-center gap-5'>
//                                           <Image src={product.media} width={60} height={60} alt={product.name} className='rounded'/>
//                                           <div>
//                                             <h4 className='font-medium line-clamp-1'>
//                                               <Link href={WEBSITE_ROUTE.PRODUCT_DETAILS(product.url)}>{product.name}</Link>
//                                             </h4>
//                                             <p className='text-sm'>Color:{product.color}</p>
//                                             <p className='text-sm'>Size:{product.size}</p>
//                                           </div>
//                                       </div>
//                                   </td>

//                                   <td className='p-3 text-center'>
//                                       <p className='text-nowrap text-sm'>{product.qty} x {product.sellingPrice.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</p>
//                                   </td>
//                               </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     <table className="w-full">
//                         <tbody>
//                             <tr>
//                                 <td className="font-medium py-2">SubTotal</td>
//                                 <td className="text-end py-2">{subtotal.toLocaleString('en-IN', {style:'currency',currency:'INR'})}</td>
//                             </tr>
//                             <tr>
//                                 <td className="font-medium py-2">Discount</td>
//                                 <td className="text-end py-2"> - {discount.toLocaleString('en-IN', {style:'currency',currency:'INR'})}</td>
//                             </tr>
//                             <tr>
//                                 <td className="font-medium py-2">Coupon Discount</td>
//                                 <td className="text-end py-2"> - {couponDiscountAmount.toLocaleString('en-IN', {style:'currency',currency:'INR'})}</td>
//                             </tr>
//                             <tr>
//                                 <td className="font-medium py-2 text-xl">Total</td>
//                                 <td className="text-end py-2">{totalAmount.toLocaleString('en-IN', {style:'currency',currency:'INR'})}</td>
//                             </tr>
//                         </tbody>
//                     </table>

//                     <div className='mt-2 mb-5'>
//                           {!isCouponApplied ?
//                             <Form {...couponForm}>
//                                 <form className='flex justify-between gap-5' onSubmit={couponForm.handleSubmit(applyCoupon)}>
//                                     <div className='w-[calc(100%-100px)]'>
//                                         <FormField control={couponForm.control} name='code'
//                                         render={({field})=>(
//                                           <FormItem>
//                                               <FormControl>
//                                                 <Input placeholder='Enter Coupon Code' {...field}/>
//                                               </FormControl>
//                                               <FormMessage/>
//                                           </FormItem>
//                                         )}>

//                                         </FormField>
//                                     </div>

//                                     <div className='w-[100px]'>
//                                         <ButtonLoading type='submit' text='Apply' className={'w-full'} loading={couponLoading}/>
//                                     </div>
//                                 </form>
//                             </Form>
//                             :
//                             <div className='flex justify-between py-1 px-5 rounded-lg bg-gray-200'>
//                                 <div>
//                                         <span className='text-xs'>Coupon:</span>
//                                         <p className='text-sm font-semibold'>{couponCode}</p>
//                                 </div>
//                                 <button onClick={removeCoupon} type='button' className='text-red-500 cursor-pointer'><IoCloseCircleSharp size={20}/></button>
//                             </div>
//                         }
//                     </div>

//                 </div>
//             </div>
//           </div>
//         </div>
//       }
//     </div>
//   )
// }

// export default Checkout
