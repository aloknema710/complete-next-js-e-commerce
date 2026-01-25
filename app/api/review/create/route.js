import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ReviewModel from "@/models/Review.Model"

export async function POST(request) {
    try {
        const auth = await isAuthenticated('user')
        if(!auth.isAuth){
            return response(false, 403, 'UnAuthorized')
        }

        await connectDB()
        const payload = await request.json()
        const Schema = zSchema.pick({
            product: true,
            userId: true,
            rating: true,
            title: true,
            review: true,
        })
        const validate = Schema.safeParse(payload)
        if(!validate.success) return response(false, 400, 'Invalid or Missing Fields')

        const{product, userId, rating, title, review} = validate.data    
        const newReview = new ReviewModel({
            product: product,user: userId,rating: rating,title: title, review: review
        })
        await newReview.save()
        return response(true,200,'Review Added Succesfully')
    } catch (error) {
        return catchError(error)
    }
}