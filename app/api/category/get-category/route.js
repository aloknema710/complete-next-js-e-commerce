import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
// import { isAuthenticated } from "@/lib/authentication";
// import { isValidObjectId } from "mongoose";
import CategoryModel from "@/models/Category.model";

export async function GET() {
    try {
        
        await connectDB()

        
        const getCategory = await CategoryModel.find({deletedAt: null}).lean()
        if(!getCategory.length){
            return response(false, 404, 'Category Not Found')
        }
        return response(true, 200, 'Category Found', getCategory)
    } catch (error) {
        catchError(error)
    }
}