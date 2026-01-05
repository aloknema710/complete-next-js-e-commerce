import { isAuthenticated } from "@/lib/authentication"
import { connectDB } from "@/lib/databaseConnection"
import { catchError, response } from "@/lib/helperFunction"
import { zSchema } from "@/lib/zodSchema"
import CategoryModel from "@/models/Category.model"

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'UnAuthorized')
        }

        await connectDB()
        const payload = await request.json()
        const Schema = zSchema.pick({
            _id: true,
            name:true,
            slug:true
        })
        const validate = Schema.safeParse(payload)
        if(!validate.success) return response(false, 400, 'Invalid or Missing Fields')

        const{_id, name, slug} = validate.data    
        const getCategory = await CategoryModel.findOne({
            deletedAt: null, _id
        })
        if(!getCategory) return response(false, 404, 'Data not Found')
        getCategory.name = name
        getCategory.slug = slug
        await getCategory.save()
        return response(true,200,'Category Updated Succesfully')
    } catch (error) {
        return catchError(error)
    }
}