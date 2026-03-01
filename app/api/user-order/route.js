import { isAuthenticated } from "@/lib/authentication";
import { response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import mongoose from "mongoose";


export async function GET() {
    try {
        const auth = await isAuthenticated('user')
        console.log('auth',auth)
        if(!auth.isAuth) return response(false,401,'Unauthorized')
        // ✅ Convert buffer ObjectId properly
        // const userId = new mongoose.Types.ObjectId(
        //     Buffer.from(auth.user.id.buffer).toString('hex')
        // )
        // const userId = new mongoose.Types.ObjectId(auth.user.id)
        const userId = auth.user.id        
        const orders = await OrderModel.find({user: userId}).populate('products.productId','name slug').populate({
            path: 'products.variantId',
            populate: {path: 'media'}
            }
        ).lean()

        return response(true,200,'Order Info.',orders)
    } catch (error) {
        console.log("ORDER ERROR:", error)
        return response(false, 500, error.message)
    }
}