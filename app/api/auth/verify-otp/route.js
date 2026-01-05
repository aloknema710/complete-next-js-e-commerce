import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const validatedSchema = zSchema.pick({
            otp: true, email: true
        })
        const validatedData = validatedSchema.safeParse(payload)
        if(!validatedData.success){
            return response(false, 401, 'Invalid or missing input field', validatedData.error)
        }
        const{ email, otp} = validatedData.data
        const getOtpData = await OTPModel.findOne({ email, otp})
        if(!getOtpData){
            return response(false, 404, 'Invalid or expired otp')
        }
        const getUser = await UserModel.findOne({ deletedAt: null, email}).lean()
        if(!getUser){
            return response(false, 404, 'user not found')
        }

        const loggedInUserData = {
            id: getUser._id,
            role: getUser.role,
            name: getUser.name,
            avatar: getUser.avatar?.url || "",
            email: getUser.email,
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT(loggedInUserData)
        .setIssuedAt()
        .setExpirationTime('24h')
        .setProtectedHeader({ alg: 'HS256'})
        .sign(secret)

        // ✅ FIX: Await the cookies() function
        const cookieStore = await cookies()
        cookieStore.set('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        })

        await getOtpData.deleteOne()
        return response(true, 200, 'Login Successful.', {
            user: loggedInUserData,
            token,
        })

    } catch (error) {
        return catchError(error)
    }    
}

// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, response } from "@/lib/helperFunction";
// import { zSchema } from "@/lib/zodSchema";
// import OTPModel from "@/models/Otp.model";
// import UserModel from "@/models/User.model";
// import { SignJWT } from "jose";
// import { cookies } from "next/headers";

// export async function POST(request) {
//     try {
//         await connectDB()
//         const payload = await request.json()
//         const validatedSchema = zSchema.pick({
//             otp: true, email: true
//         })
//         const validatedData = validatedSchema.safeParse(payload)
//         if(!validatedData.success){
//             return response(false, 401, 'Invalid or missing input field', validatedData.error)
//         }
//         const{ email, otp} = validatedData.data
//         const getOtpData = await OTPModel.findOne({ email, otp})
//         if(!getOtpData){
//             return response(false, 404, 'Invalid or expired otp')
//         }
//         const getUser = await UserModel.findOne({ deletedAt: null, email}).lean()
//         if(!getUser){
//             return response(false, 404, 'user not found')
//         }

//         // const loggedInUserData = {
//         //     id: getUser._id,
//         //     role: getUser._role,
//         //     name: getUser._name,
//         //     avatar: getUser._avatar,
//         // }

//         const loggedInUserData = {
//             id: getUser._id,
//             role: getUser.role,
//             name: getUser.name,
//             avatar: getUser.avatar.url,  // get avatar URL string (not the object)
//             email: getUser.email,        // add email here so frontend can use it
//         }

//         const secret = new TextEncoder().encode(process.env.SECRET_KEY)
//         const token = await new SignJWT(loggedInUserData)
//         .setIssuedAt()
//         .setExpirationTime('24h')
//         .setProtectedHeader({ alg: 'HS256'})
//         .sign(secret)

//         const cookieStore = await cookies()
//         cookieStore.set({
//             name: 'access_token',
//             value: token,
//             httpOnly: process.env.NODE_ENV === 'production',
//             path: '/',
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//         })


//         await getOtpData.deleteOne()
//         return response(true, 200, 'Login Succesfull.', {
//             user: loggedInUserData,
//             token,
//         })

//     } catch (error) {
//         return catchError(error)
//     }    
// }