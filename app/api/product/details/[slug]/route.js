import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { isValidObjectId } from "mongoose";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ReviewModel from "@/models/Review.Model";
import MediaModel from "@/models/Media.model";
// MediaModel

export async function GET(request, { params }) {
    try {

        await connectDB()
        const getParams = await params
        const slug = getParams.slug
        // const { slug } = params;
        const searchParams = request.nextUrl.searchParams
        const size = searchParams.get('size')
        const color = searchParams.get('color')

        const filter = {
            deletedAt: null
        }

        if(!slug) return response(false, 404, 'Product not Found')
            
        filter.slug = slug
            
            // getproduct
        const getProduct = await ProductModel.findOne(filter).populate('media', 'secure_url').lean()
        if(!getProduct) return response(false, 404, 'Product not Found')
                
        const variantFilter = {product: getProduct._id}
        if(size) variantFilter.size = size
        if(color) variantFilter.color = color
                
        const variant = await ProductVariantModel.findOne(variantFilter).populate('media','secure_url').lean()
        if(!variant) return response(false, 404, 'Product not Found')
        

        const getColor = await ProductVariantModel.distinct('color', {product: getProduct._id})
        const getsize = await ProductVariantModel.aggregate([
                    {$match: {product: getProduct._id}},
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


        const getReview = await ReviewModel.countDocuments({product: getProduct._id})
        const productData = {
            products: getProduct,
            variant: variant,
            colors: getColor,
            size : getsize.length ? getsize.map(item=>item.size):[],
            reviewCount: getReview
        }

        return response(true, 200, 'Product Data Found', productData)
    } catch (error) {
        return catchError(error)
    }
}