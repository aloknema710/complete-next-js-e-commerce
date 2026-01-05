// // app/api/cloudinary-signature/route.js
// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { paramsToSign } = body;

//     console.log("📝 Parameters received for signing:", paramsToSign);

//     // Generate the signature
//     const signature = cloudinary.utils.api_sign_request(
//       paramsToSign,
//       process.env.CLOUDINARY_API_SECRET
//     );

//     console.log("✅ Generated signature:", signature);

//     return Response.json({ 
//       signature 
//     });
    
//   } catch (error) {
//     console.error('❌ Cloudinary signature error:', error);
//     return Response.json(
//       { error: 'Failed to generate signature' },
//       { status: 500 }
//     );
//   }
// }


// app/api/cloudinary-signature/route.js
// import { v2 as cloudinary } from 'cloudinary';

// // Configure Cloudinary (if not already done in your lib/cloudinary.js)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { paramsToSign } = body;

//     // Generate the signature
//     const signature = cloudinary.utils.api_sign_request(
//       paramsToSign,
//       process.env.CLOUDINARY_API_SECRET
//     );

//     return Response.json({ signature });
    
//   } catch (error) {
//     console.error('Cloudinary signature error:', error);
//     return Response.json(
//       { error: 'Failed to generate signature' },
//       { status: 500 }
//     );
//   }
// }

import cloudinary from "@/lib/cloudinary";
import { catchError } from "@/lib/helperFunction";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const payload = await request.json()
        const {paramsToSign} = payload
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_SECRET_KEY)
        console.log("signature payload:",payload)
        return NextResponse.json({signature})
    } catch (error) {
        return catchError(error)
    }
}