import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import z from "zod";

export async function POST(request){
    try {
        await connectDB();
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            email: true
        }).extend({
            password: z.string()
        })
        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return response(false, 401, 'invalid or missing input fields', validatedData.error)
        }
        const { email, password } = validatedData.data

        const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password")
        if(!getUser){
            return response(false, 404, 'invalid login credentials', validatedData.error)
        }

        // resend email verification link if user isn't verified
        if(!getUser.isEmailVerified){
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const token = await new SignJWT({ userId: getUser._id.toString() })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);
            
            console.log("Token generated",token);
            
            await sendMail('Email verification request',
                email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))        
                console.log("Email sent");

            return response(false, 401, 'Email not verified yet, we have sent a verification link to you')
        }
        
        // password verification
        const isPasswordVerified = await getUser.comparePassword(password)
        if(!isPasswordVerified){
            return response(false, 404, 'Invalid Login Credentials')
        }

        // otp generation
        await OTPModel.deleteMany({ email }) // deleting old otps
        const otp = generateOTP()
        const newOtpData = new OTPModel({
            email, otp
        })
        await newOtpData.save()

        const otpEmailStatus = await sendMail('your login verification code', email, otpEmail(otp))
        if(!otpEmailStatus.success){
            return response(false, 400, 'fail to send otp')
        }

        // cookies().set('access_token', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     path: '/',
        //     sameSite: 'lax',
        //     maxAge: 60 * 60 * 24 * 7 // 7 days
        //     })
        return response(true, 200, 'otp sent please verify')

    } catch (error) {
        return catchError(error)
    }
}