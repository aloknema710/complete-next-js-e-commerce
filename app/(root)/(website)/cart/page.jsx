"use client";
import { Button } from "@/components/ui/button";
import WebsiteBreadCrumb from "@/components/Website/WebsiteBreadCrumb";
import { WEBSITE_ROUTE } from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import imgPlaceholder from "@/public/assets/images/img-placeholder.webp";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "@/store/reducer/cartReducer";
import { IoCloseCircleOutline } from "react-icons/io5";

const breadCrumb = {
  title: "Cart",
  links: [{ label: "Cart" }],
};

const CartPage = () => {
  // const cart = useSelector(store=>store.CartStore)
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  console.log('cart',cart)
//   const [qty, setQty] = useState(1);
  const [subTotal, setSubTotal] = useState(0)
  const [discount, setDiscount] = useState(0)
//   const handleQty = (actionType) => {
//     if (actionType === "inc") setQty((prev) => prev + 1);
//     else {
//       if (qty !== 1) setQty((prev) => prev - 1);
//     }
//   };
  useEffect(()=>{
        const cartProducts = cart.products
        const totalAmount = cartProducts.reduce((sum, product)=>sum + (product.sellingPrice * product.qty),0)
        const discount = cartProducts.reduce((sum, product)=>sum + (product.mrp - product.sellingPrice) * product.qty,0)
        setSubTotal(totalAmount)
        setDiscount(discount)
      },[cart])
  return (
    <div>
      <WebsiteBreadCrumb props={breadCrumb} />
      {cart.count === 0 ? (
        <div className="w-screen h-[500px] flex justify-center items-center py-32">
          <div className="text-center">
            <h4 className="text-4xl font-semibold mb-5">Your Cart is empty!</h4>
            <Button type="button" asChild>
              <Link href={WEBSITE_ROUTE.SHOP}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4">
          <div className="lg:w-[70%] w-full">
            <table className="w-full border">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">Quantity</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {cart.products.map((product) => (
                  <tr key={product.variantId} className="border-b">
                    <td className="p-3 text-left">
                      <div className="flex items-center gap-5">
                        <Image
                          src={product.media || imgPlaceholder}
                          alt={product.name}
                          width={60}
                          height={60}
                        />
                        <div>
                          <h4 className="text-lg font-medium line-clamp-1">
                            <Link
                              href={WEBSITE_ROUTE.PRODUCT_DETAILS(product.url)}
                            >
                              {product.name}
                            </Link>
                          </h4>
                          <p>Color: {product.color}</p>
                          <p>Size: {product.size}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      {product.sellingPrice.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex justify-center">
                        <div className="flex items-center h-10 border rounded-full">
                          <button
                            type="button"
                            className="h-full w-10 flex justify-center items-center"
                            onClick={() => dispatch(decreaseQuantity({productId: product.productId,
                              variantId: product.variantId}))}
                          >
                            <HiMinus />
                          </button>
                          <input
                            type="text"
                            value={product.qty}
                            readOnly
                            className="w-14 text-center border-none outline-none"
                          />
                          <button
                            type="button"
                            className="h-full w-10 flex justify-center items-center"
                            onClick={() => dispatch(increaseQuantity({productId: product.productId,
                              variantId: product.variantId}))}
                          >
                            <HiPlus />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 text-right">
                      {(product.sellingPrice * product.qty).toLocaleString(
                        "en-IN",
                        {
                          style: "currency",
                          currency: "INR",
                        },
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: product.productId,
                              variantId: product.variantId,
                            }),
                          )
                        }
                        className="text-red-500"
                      >
                        <IoCloseCircleOutline />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:w-[70%] w-full">
            <div className="rounded bg-gray-50 p-5 sticky top-5">
                <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
                <div>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="font-medium py-2">SubTotal</td>
                                <td className="text-end py-2">{subTotal.toLocaleString('en-IN', {style:'currency',currency:'INR'})}</td>
                            </tr>
                            <tr>
                                <td className="font-medium py-2">Discount</td>
                                <td className="text-end py-2">{discount.toLocaleString('en-IN', {style:'currency',currency:'INR'})}</td>
                            </tr>
                            <tr>
                                <td className="font-medium py-2">Total</td>
                                <td className="text-end py-2">{subTotal.toLocaleString('en-IN', {style:'currency',currency:'INR'})}</td>
                            </tr>
                        </tbody>
                    </table>

                    <Button type='button' asChild className={"w-full bg-black rounded-full mt-5 mb-3"}>
                        <Link href={WEBSITE_ROUTE.CHECKOUT}>Proceed to Checkout</Link>
                    </Button>
                    <p className="text-center">
                        <Link href={WEBSITE_ROUTE.SHOP} className="hover:underline">Continue Shopping</Link>
                    </p>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
