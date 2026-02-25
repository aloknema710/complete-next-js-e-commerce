import { isAuthenticated } from "@/lib/authentication";
import { response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";
import mongoose from "mongoose";

export async function GET() {
    try {
        const auth = await isAuthenticated('user')
        console.log('auth',auth)
        if(!auth.isAuth) return response(false,401,'Unauthorized')
        const userId = auth.user.id
        // ✅ Convert buffer ObjectId properly
        // const userId = new mongoose.Types.ObjectId(
        //     Buffer.from(auth.user.id.buffer).toString('hex')
        // )
        // const userId = new mongoose.Types.ObjectId(auth.user.id)
        const recentOrders = await OrderModel.find({user: userId}).populate('products.productId','name slug').populate({
            path: 'products.variantId',
            populate: {path: 'media'}
            }
        ).lean()
        const totalOrder = await OrderModel.countDocuments({user:userId})
        return response(true,200,'Dashboard Info.',{recentOrders,totalOrder})
    } catch (error) {
        console.log("DASHBOARD ERROR:", error)
        return response(false, 500, error.message)
    }
}