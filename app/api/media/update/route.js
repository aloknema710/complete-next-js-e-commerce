import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";
import { FaLastfmSquare } from "react-icons/fa";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()

        const payload = await request.json()
        // const {_id, alt, title} = payload

        const filter = {
            deletedAt: null
        }

        const schema = zSchema.pick({
            _id: true, alt: true, title: true
        })

        const validate = schema.safeParse(payload)
        if(!validate.success) return response(false, 400, 'Invalid/Missing Fields.', validate.error)

        const {_id, alt, title} = validate.data
        if(!isValidObjectId(_id)) return response(false,400,'Invalid Object Id')

        const getMedia = await MediaModel.findById(_id)
        if(!getMedia) return response(false, 404, 'No Media Found')
        getMedia.alt = alt
        getMedia.title = title

        await getMedia.save()

        return response(true, 200, 'Media Updated Succesfully')
    } catch (error) {
        catchError(error)
    }
}