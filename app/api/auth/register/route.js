import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

// export async function POST(request) {
//     try {
//         await connectDB();
//         const validationSchema = zSchema.pick({
//             name: true,
//             email: true,
//             password: true,
//             // passwordConfirm: true
//         })
//         const payload = await request.json();
//         const validatedData = validationSchema.safeParse(payload);
//         if(!validatedData.success){
//                 return response(false, 401, "Invalid or Missing Input Field.", validatedData.error)
//         }
//         const { name, email, password } = validatedData.data;
//         // Check if user already exists
//         const checkUser = await UserModel.exists({ email });
//         if(checkUser){
//             return response(false, 409, "User already exists with this email. Please login to your account.");
//         }

//         // Create new user
//         const NewRegistration = await UserModel.create({
//             name, email, password,
//         })
//         await NewRegistration.save();

//         const secret = new TextEncoder().encode(process.env.SECRET_KEY);
//         const token = await new SignJWT({ UserId: NewRegistration._id })
//             .setProtectedHeader({ alg: "HS256" })
//             .setIssuedAt()
//             .setExpirationTime("24h")
//             .sign(secret);
//         await sendMail('Email verification request',
//              email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`))

//         return response(true, 201, "Registration Succesfull, Please verify your email address .");     
//     } catch (error) {
//         catchError(error)
//     }
// }


export async function POST(request) {
    try {
        console.log("Register API called");
        await connectDB();
        console.log("Database connected");
        
        const validationSchema = zSchema.pick({
            name: true,
            email: true,
            password: true,
            // avatar: { url: "" } // Temporary fix
        })
        
        const payload = await request.json();
        console.log("Payload received:", payload);
        
        const validatedData = validationSchema.safeParse(payload);
        console.log("Validation result:", validatedData);
        
        if(!validatedData.success){
            console.log("Validation failed:", validatedData.error);
            return response(false, 401, "Invalid or Missing Input Field.", validatedData.error)
        }
        
        const { name, email, password } = validatedData.data;
        console.log("Validated data:", { name, email });
        
        // Check if user already exists
        const checkUser = await UserModel.exists({ email });
        console.log("User exists check:", checkUser);
        
        if(checkUser){
            console.log("User already exists");
            return response(false, 409, "User already exists with this email. Please login to your account.");
        }

        // Create new user
        console.log("Creating new user...");
        const NewRegistration = await UserModel.create({
            name, email, password,
        })
        await NewRegistration.save();
        console.log("User created successfully:", NewRegistration._id);

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ userId: NewRegistration._id.toString() })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret);
            
        console.log("Token generated");
        
        await sendMail('Email verification request',
             email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))
        
        console.log("Email sent");

        return response(true, 201, "Registration Successful, Please verify your email address.");     
    } catch (error) {
        console.log("Error in register API:", error);
        return catchError(error);
    }
}