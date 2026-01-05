import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import CouponModel from "@/models/Coupon.model"

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'UnAuthorized')
        }

        await connectDB()
        const payload = await request.json()
        const Schema = zSchema.pick({
            code: true,
            discountPercentage: true,
            minShoppingAmount: true,
            validity: true
        })
        const validate = Schema.safeParse(payload)
        if(!validate.success) return response(false, 400, 'Invalid or Missing Fields')

        const couponData = validate.data    
        const newcoupon = new CouponModel({
            code: couponData.code,
            discountPercentage: couponData.discountPercentage,
            minShoppingAmount: couponData.minShoppingAmount,
            validity: couponData.validity
        })
        await newcoupon.save()
        return response(true,200,'Coupon Added Succesfully')
    } catch (error) {
        return catchError(error)
    }
}