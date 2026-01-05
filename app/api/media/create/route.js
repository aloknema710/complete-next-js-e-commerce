// app/api/media/create/route.js
// import cloudinary from "@/lib/cloudinary";
// import { connectDB } from "@/lib/databaseConnection";
// import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
// import MediaModel from "@/models/Media.model";

// export async function POST(request) {
//     console.log("=== MEDIA UPLOAD API CALLED ===");
    
//     let payload;
//     try {
//         payload = await request.json();
//         console.log("📦 Payload received:", JSON.stringify(payload, null, 2));
//     } catch (e) {
//         console.error("❌ Failed to parse payload:", e);
//         return response(false, 400, 'Invalid JSON payload');
//     }

//     try {
//         console.log("🔐 Checking authentication...");
//         const auth = await isAuthenticated('admin');
//         console.log("🔑 Auth result:", { 
//             isAuth: auth.isAuth, 
//             user: auth.user 
//         });
        
//         if(!auth.isAuth){
//             console.log("❌ Authentication failed");
//             return response(false, 403, 'UnAuthorized');
//         }

//         console.log("✅ Authentication successful");
        
//         console.log("🗄️ Connecting to database...");
//         await connectDB();
//         console.log("✅ Database connected");

//         // Add user ID to each media item
//         const mediaWithUser = payload.map(mediaItem => ({
//             ...mediaItem,
//             uploadedBy: auth.user.id
//         }));

//         console.log("📝 Media data to insert:", JSON.stringify(mediaWithUser, null, 2));
        
//         console.log("💾 Attempting to insert media...");
//         const newMedia = await MediaModel.insertMany(mediaWithUser);
//         console.log("✅ Media inserted successfully:", newMedia.length, "items");
//         console.log("📄 Inserted media details:", JSON.stringify(newMedia, null, 2));
        
//         return response(true, 200, 'Media Uploaded Successfully.', newMedia);
        
//     } catch (error) {
//         console.error("❌ Error in media upload:", error);
//         console.error("🔍 Error details:", {
//             name: error.name,
//             message: error.message,
//             code: error.code,
//             keyPattern: error.keyPattern,
//             keyValue: error.keyValue
//         });

//         // Cleanup from Cloudinary if insertion failed
//         if(payload && payload.length > 0){
//             const publicIds = payload.map(data => data.public_id).filter(Boolean);
//             if(publicIds.length > 0){
//                 console.log("🧹 Cleaning up Cloudinary files:", publicIds);
//                 try {
//                     await cloudinary.api.delete_resources(publicIds);
//                     console.log("✅ Cloudinary cleanup successful");
//                 } catch (deleteError) {
//                     console.error("❌ Cloudinary cleanup error:", deleteError);
//                 }
//             }
//         }
        
//         return catchError(error);
//     }
// }


import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";

export async function POST(request) {
    const payload = await request.json()
    console.log("Payload received in backend:", payload);

    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'UnAuthorized')
        }
        await connectDB()
        const newMedia = await MediaModel.insertMany(payload)
        return response(true, 200, 'Media Uploaded Succesfully.', newMedia)
    } catch (error) {
        if(payload && payload.length > 0){
            const publicIds = payload.map(data =>data.public_id)
            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }
        console.error("Error inserting media:", error);
        return catchError(error)
    }
}