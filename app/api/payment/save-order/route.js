import { orderNotification } from "@/email/OrderNotification";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OrderModel from "@/models/Order.model";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import z from "zod";
// import z from "zod/v3";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        console.log('Received payload:', payload); // Check what userId value is being sent
        
        const productSchema = z.object({
            productId: z.string().length(24, 'Invalid Product Id'),
            variantId: z.string().length(24, 'Invalid Variant Id'),
            name: z.string().min(1),
            qty: z.number().min(1),
            mrp: z.number().nonnegative(),
            sellingPrice: z.number().nonnegative()
        })

        const orderSchema = zSchema.pick({
            name: true,
            email: true,
            phone: true,
            country: true,
            state: true,
            city: true,
            pincode: true,
            landmark: true,
            ordernote: true
        }).extend({
            userId: z.string().optional(),
            razorpay_payment_id: z.string().min(3, 'Payment Id is required'),
            razorpay_order_id: z.string().min(3, 'Order Id is required'),
            razorpay_signature: z.string().min(3, 'Signature is required'),
            subtotal: z.number().nonnegative(),
            discount: z.number().nonnegative(),
            couponDiscountAmount: z.number().nonnegative(),
            totalAmount: z.number().nonnegative(),
            products: z.array(productSchema)
        })

        const validate = orderSchema.safeParse(payload)
        if(!validate.success) return response(false,400,'Invalid or Missing Fields.', {error: validate.error})
        const validatedData = validate.data
        
        // payment verification
        const verification = validatePaymentVerification({
            order_id: validatedData.razorpay_order_id,
            payment_id: validatedData.razorpay_payment_id,
            // signature: validatedData.razorpay_signature
        },validatedData.razorpay_signature, process.env.RAZORPAY_KEY_SECRET)

        let paymentVerification = false
        if(verification) paymentVerification = true

        if(!paymentVerification) return response(false,400,'Payment verification failed.')

        const newOrder = await OrderModel.create({
            user: validatedData.userId,
            // ...(validatedData.userId && { user: validatedData.userId }),
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            country: validatedData.country,
            state: validatedData.state,
            city: validatedData.city,
            pincode: validatedData.pincode,
            landmark: validatedData.landmark,
            ordernote: validatedData.ordernote,
            products: validatedData.products,
            // subtotal: validatedData.subtotal,
            discount: validatedData.discount,
            couponDiscountAmount: validatedData.couponDiscountAmount,
            totalAmount: validatedData.totalAmount,
            subtotal: validatedData.subtotal,
            payment_id: validatedData.razorpay_payment_id,
            order_id: validatedData.razorpay_order_id,
            // deletedAt: validatedData.phone,
            status: paymentVerification ? 'pending' : 'unverified'
        })
        try {
            const mailData = {
                order_id: validatedData.razorpay_order_id,
                orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${validatedData.razorpay_order_id}`
            }
            await sendMail('Order Placed Succesfully', validatedData.email, orderNotification(mailData))
        } catch (error) {
            console.log('Error in creating order:', error)
        }

        return response(true, 200, 'Order Placed Successfully')

    } catch (error) {
        return catchError(error)
    }
}



// import { orderNotification } from "@/email/OrderNotification";
// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { sendMail } from "@/lib/sendMail";
// import { zSchema } from "@/lib/zodSchema";
// import OrderModel from "@/models/Order.model";
// import crypto from "crypto";
// import z from "zod/v3";

// export async function POST(request) {
//   try {
//     await connectDB();

//     const payload = await request.json();

//     /* ---------------- PRODUCT SCHEMA ---------------- */

//     const productSchema = z.object({
//       productId: z.string().length(24, "Invalid Product Id"),
//       variantId: z.string().length(24, "Invalid Variant Id"),
//       name: z.string().min(1),
//       qty: z.number().min(1),
//       mrp: z.number().nonnegative(),
//       sellingPrice: z.number().nonnegative(),
//     });

//     /* ---------------- ORDER SCHEMA ---------------- */

//     const orderSchema = zSchema
//       .pick({
//         name: true,
//         email: true,
//         phone: true,
//         country: true,
//         state: true,
//         city: true,
//         pincode: true,
//         landmark: true,
//         ordernote: true,
//       })
//       .extend({
//         userId: z.string().optional(),
//         razorpay_payment_id: z.string().min(3, "Payment Id is required"),
//         razorpay_order_id: z.string().min(3, "Order Id is required"),
//         razorpay_signature: z.string().min(3, "Signature is required"),
//         subtotal: z.number().nonnegative(),
//         discount: z.number().nonnegative(),
//         couponDiscountAmount: z.number().nonnegative(),
//         totalAmount: z.number().nonnegative(),
//         products: z.array(productSchema),
//       });

//     const validate = orderSchema.safeParse(payload);

//     if (!validate.success) {
//       return response(false, 400, "Invalid or Missing Fields.", {
//         error: validate.error,
//       });
//     }

//     const validatedData = validate.data;

//     /* ---------------- PAYMENT VERIFICATION ---------------- */

//     const body =
//       validatedData.razorpay_order_id +
//       "|" +
//       validatedData.razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     const isAuthentic =
//       expectedSignature === validatedData.razorpay_signature;

//     if (!isAuthentic) {
//       return response(false, 400, "Payment verification failed.");
//     }

//     /* ---------------- CREATE ORDER ---------------- */

//     const newOrder = await OrderModel.create({
//       user: validatedData.userId,
//       name: validatedData.name,
//       email: validatedData.email,
//       phone: validatedData.phone,
//       country: validatedData.country,
//       state: validatedData.state,
//       city: validatedData.city,
//       pincode: validatedData.pincode,
//       landmark: validatedData.landmark,
//       ordernote: validatedData.ordernote,
//       products: validatedData.products,
//       subtotal: validatedData.subtotal,
//       discount: validatedData.discount,
//       couponDiscountAmount: validatedData.couponDiscountAmount,
//       totalAmount: validatedData.totalAmount,
//       payment_id: validatedData.razorpay_payment_id,
//       order_id: validatedData.razorpay_order_id,
//       status: "pending",
//     });

//     /* ---------------- SEND EMAIL ---------------- */

//     try {
//       const mailData = {
//         order_id: validatedData.razorpay_order_id,
//         orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${validatedData.razorpay_order_id}`,
//       };

//       await sendMail(
//         "Order Placed Successfully",
//         validatedData.email,
//         orderNotification(mailData)
//       );
//     } catch (error) {
//       console.log("Email sending failed:", error);
//     }

//     return response(true, 200, "Order Placed Successfully", newOrder);
//   } catch (error) {
//     return catchError(error);
//   }
// }
