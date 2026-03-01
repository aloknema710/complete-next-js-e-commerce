import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";

export async function PUT(request) {
    try {
        await connectDB()
        const auth = await isAuthenticated('user')
        console.log('auth',auth)
        
        if(!auth.isAuth) return response(false,401,'Unauthorized')
        const userId = auth.user.id
        const user = await UserModel.findById(userId)
        
        if(!user) return response(false,404,'User not found')

        const formData = await request.formData()
        const file = formData.get('file')

        user.name = formData.get('name') 
        user.phone = formData.get('phone')
        user.address = formData.get('address')
        
        if(file){
            const fileBuffer = await file.arrayBuffer()
            const base64File = `data:${file.type};base64,${Buffer.from(fileBuffer).toString('base64')}`
            const uploadFile = await cloudinary.uploader.upload(base64File, {
                upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPDATE_PRESET,
                
               }
            )
            // Delete old avatar if exists
            if(user?.avatar?.public_id){
                await cloudinary.api.delete_resources([user.avatar.public_id])
            }

            user.avatar = {
                url: uploadFile.secure_url,
                public_id: uploadFile.public_id
            }
        }
        await user.save()

        return response(true,200,'Profile Data Updated.',
            {
                _id: user._id.toString(),
                role: user.role,
                name: user.name,
                avatar: user.avatar,
            }
        )
    } catch (error) {
        return catchError(error)
    }
}