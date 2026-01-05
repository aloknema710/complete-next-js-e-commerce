import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import ProductModel from "@/models/Product.model"
import ProductVariantModel from "@/models/ProductVariant.model"

export async function POST(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'UnAuthorized')
        }

        await connectDB()
        const payload = await request.json()
        const Schema = zSchema.pick({
            product: true,
            sku: true,
            color: true,
            size: true,
            mrp: true,
            sellingPrice: true,
            discountPercentage: true,
            media: true
        })
        const validate = Schema.safeParse(payload)
        if(!validate.success) return response(false, 400, 'Invalid or Missing Fields')

        const VariantData = validate.data    
        const newProductVariant = new ProductVariantModel({
            product: VariantData.product,
            sku: VariantData.sku,
            color: VariantData.color,
            size: VariantData.size,
            mrp: VariantData.mrp,
            sellingPrice: VariantData.sellingPrice,
            discountPercentage: VariantData.discountPercentage,
            media: VariantData.media
        })
        await newProductVariant.save()
        return response(true,200,'Product Variant Added Succesfully')
    } catch (error) {
        return catchError(error)
    }
}