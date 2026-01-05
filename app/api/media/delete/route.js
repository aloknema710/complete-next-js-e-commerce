import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import MediaModel from "@/models/Media.model";
import mongoose from "mongoose";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()
        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType
        if(!Array.isArray(ids) || ids.length === 0){
            return response(false, 400, 'Empty or Invalid id List')
        }

        const media = await MediaModel.find({_id: {$in: ids}}).lean()
        if(!media.length){
            return response(false, 404, 'Data not found')
        }
        if(!['SD', 'RSD'].includes(deleteType)){
            return response(false, 400, 'Invalid Delete Type')
        }
        if(deleteType === 'SD'){
            await MediaModel.updateMany({_id: {$in: ids}},{$set: {deletedAt: new Date().toISOString()}})
        }
        else{
            await MediaModel.updateMany({_id: {$in: ids}},{$set: {deletedAt: null}})
        }
        return response(true, 200, deleteType === 'SD' ? 'Data Moved into Trash.' : 'Data Restored')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, 'Unauthorized')
        }
        await connectDB()
        const payload = await request.json()
        const ids = payload.ids || []
        const deleteType = payload.deleteType
        if(!Array.isArray(ids) || ids.length === 0){
            return response(false, 400, 'Empty or Invalid id List')
        }

        const media = await MediaModel.find({_id: {$in: ids}}).session(session).lean()
        if(!media.length){
            return response(false, 404, 'Data not found')
        }
        if(deleteType !== 'PD'){
            return response(false, 400, 'Invalid Delete Type')
        }
        await MediaModel.deleteMany({_id: {$in: ids}}).session(session)

        // deleting from cloudinary
        const publicIds = media.map(m => m.public_id)

        try {
            await cloudinary.api.delete_resources(publicIds)
        } catch (error) {
            await session.abortTransaction()
            session.endSession()   
            return response(false, 500, 'Failed to delete media from Cloudinary.')
        }

        await session.commitTransaction()
        session.endSession()
        return response(true, 200, 'Media deleted permanently.')
        
    } catch (error) {
        await session.abortTransaction()
        session.endSession() 
        return catchError(error)
    }
}