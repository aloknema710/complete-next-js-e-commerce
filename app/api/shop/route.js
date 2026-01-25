import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";


export async function GET(request) {
    try {
        
        await connectDB()
        const searchParams = request.nextUrl.searchParams

        const size = searchParams.get('size')
        const color = searchParams.get('color')
        const minPrice = parseInt(searchParams.get('minPrice')) || 0
        const maxPrice = parseInt(searchParams.get('maxPrice')) || 100000
        const categorySlug = searchParams.get('category')
        const search = searchParams.get('q')

        // pagination
        const limit = parseInt(searchParams.get('limit')) || 9
        const page = parseInt(searchParams.get('page')) || 0
        const skip = page*limit

        //sorting
        const sortOptions = searchParams.get('sort') || 'default_sorting'
        let sortquery = {}
        if(sortOptions === 'default_sorting') sortquery = {createdAt: -1}
        if(sortOptions === 'asc') sortquery = {name: 1}
        if(sortOptions === 'desc') sortquery = {name: -1}
        // if(sortOptions === 'price_high_low') sortquery = {sellingPrice: 1}
        // if(sortOptions === 'price_low_high') sortquery = {sellingPrice: -1}
        if(sortOptions === 'price_high_low') sortquery = { sellingPrice: -1 }
        if(sortOptions === 'price_low_high') sortquery = { sellingPrice: 1 }

        //find category by slug
        let categoryId = []
        if(categorySlug){
            const slugs = categorySlug.split(',')
            const categoryData = await CategoryModel.find({deletedAt: null, slug: {$in: slugs}}).select('_id').lean()
            // if(categoryData) categoryId = categoryData._id
            categoryId = categoryData.map(category=>category._id)
        }

        //match stage
        let matchStage = {}
        if(categoryId.length > 0) matchStage.category = {$in: categoryId} // filter by category

        if(search){
            matchStage.name = {$regex: search, $options: 'i'}
        }

        //aggregation
        const products = await ProductModel.aggregate([
            {$match: matchStage},
            {$sort: sortquery},
            {$skip: skip},
            {$limit: limit + 1},
            {$lookup:
                {
                    from: 'productvariants',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'variants'
                }
            },
            {$addFields:
                {
                    variants:{
                        $filter:{
                            input: "$variants",
                            as: "variant",
                            cond:{
                                $and: [
                                    size?{$in: ["$$variant.size", size.split(',')]} : {$literal: true},
                                    color?{$in: ["$$variant.color", color.split(',')]} : {$literal: true},
                                    {$gte: ["$$variant.sellingPrice", minPrice]},
                                    {$lte: ["$$variant.sellingPrice", maxPrice]}
                                ]
                            }
                        }
                    }
                }

            },
            {
                $match:{
                    variants: {$ne: []}
                }
            },
            {$lookup:
                {
                    from: 'media',
                    localField: 'media',
                    foreignField: '_id',
                    as: 'media'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercentage: 1,

                    media: {
                    $map: {
                        input: "$media",
                        as: "m",
                        in: {
                        _id: "$$m._id",
                        secure_url: "$$m.secure_url",
                        alt: "$$m.alt"
                        }
                    }
                    },

                    variants: {
                    color: 1,
                    size: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercentage: 1
                    }
                }
                }

        ])

        // check is more data exists

        let nextPage = null
        if(products.length > limit){
            nextPage = page + 1
            products.pop() //remove extra item
        }
        return response(true,200, 'Products Data Found', {products, nextPage})
    } catch (error) {
        catchError(error)
    }
}