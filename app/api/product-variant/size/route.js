import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
// import { isAuthenticated } from "@/lib/authentication";
// import { isValidObjectId } from "mongoose";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function GET() {
    try {
        
        await connectDB()

        
        const getsize = await ProductVariantModel.aggregate([
            {$sort:{ id: 1}},
            {
                $group: {
                    _id: "$size",
                    first: {$first: "$_id"}
                }
            },
            {$sort:{first: 1}},
            {$project: {_id: 0, size:"$_id"}}
        ])
        if(!getsize.length){
            return response(false, 404, 'size Not Found')
        }

        const sizes = getsize.map(item=>item.size)
        return response(true, 200, 'size Found', sizes)
    } catch (error) {
        catchError(error)
    }
}