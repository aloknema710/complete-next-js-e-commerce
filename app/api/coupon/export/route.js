import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";

export async function GET(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()

        const filter = {
            deletedAt: null
        }

        const getCoupon = await CouponModel.find(filter).sort({createdAt: -1}).lean()
        if(!getCoupon) return response(false, 404, 'Data not Found, Collection Empty')
        return response(true, 200, 'Data Found', getCoupon)
    } catch (error) {
        catchError(error)
    }
}