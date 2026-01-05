import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";

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

        const data = await CouponModel.find({_id: {$in: ids}}).lean()
        if(!data.length){
            return response(false, 404, 'Data not found')
        }
        if(!['SD', 'RSD'].includes(deleteType)){
            return response(false, 400, 'Invalid Delete Type')
        }
        if(deleteType === 'SD'){
            await CouponModel.updateMany({_id: {$in: ids}},{$set: {deletedAt: new Date().toISOString()}})
        }
        else{
            await CouponModel.updateMany({_id: {$in: ids}},{$set: {deletedAt: null}})
        }
        return response(true, 200, deleteType === 'SD' ? 'Data Moved into Trash.' : 'Data Restored')
    } catch (error) {
        return catchError(error)
    }
}

export async function DELETE(request) {

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

        const data = await CouponModel.find({_id: {$in: ids}}).lean()
        if(!data.length){
            return response(false, 404, 'Data not found')
        }
        if(deleteType !== 'PD'){
            return response(false, 400, 'Invalid Delete Type')
        }
        await CouponModel.deleteMany({_id: {$in: ids}})

        return response(true, 200, 'Media deleted permanently.')
        
    } catch (error) {
        return catchError(error)
    }
}