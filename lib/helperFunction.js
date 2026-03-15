// import { jwtVerify } from "jose"
// import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const response = (success, statusCode, message, data) => {
    return NextResponse.json({
        success,
        message,    
        data,
        statusCode
    })
}

export const catchError = (error, customMessage) => {
    if (error.code === 11000) {
        const keys = Object.keys(error.keyPattern).join(", ")
        error.message = `Duplicate fields: ${keys}. These field values must be unique.`
    }
    let errorObj = {}
    if(process.env.NODE_ENV === 'development'){
        errorObj = {
            message: error.message,
            error
        }
    }
    else{
        errorObj = {
            message: customMessage || "Internal Server Error",
        }
    }
    return response(false, 500, error.message, errorObj)
}

export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random()*900000).toString()
    return otp
}

// export const isAuthenticated = async(role) =>{
//     try {
//         const cookieStore = await cookies()
//         if(!cookieStore.has('access_token')){
//             return{
//                 isAuth: false
//             }
//         }
//         const access_token = cookieStore.get('access_token')
//         const {payload} = await jwtVerify(access_token.value, new TextEncoder().encode(process.env.SECRET_KEY))
//         if(payload.role !== role){
//             return{
//                 isAuth: false
//             }
//         }

//         return{
//             isAuth: true,
//             userId: payload._id
//         }
//     } catch (error) {
//         return{
//             isAuth:false,
//             error
//         }
//     }
// }


// lib/helperFunction.js - Update isAuthenticated function



export const columnConfig = (column, isCreatedAt= false, isUpdatedAt = false, isDeletedAt = false) =>{
    const newColumn = [...column]
    
    if(isCreatedAt){
        newColumn.push({
            accessorKey:'createdAt',
            header: 'Created At',
            Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleDateString())
        })
    }
    if(isUpdatedAt){
        newColumn.push({
            accessorKey:'updatedAt',
            header: 'Updated At',
            Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleDateString())
        })
    }
    if(isDeletedAt){
        newColumn.push({
            accessorKey:'deletedAt',
            header: 'Deleted At',
            Cell: ({ renderedCellValue }) => (new Date(renderedCellValue).toLocaleDateString())
        })
    }
    return newColumn;
}


export const statusBadge = (status) =>{
    const statusColorConfig = {
        pending: 'bg-blue-500',
        processing: 'bg-yellow-500',
        shipped: 'bg-cyan-500',
        delivered: 'bg-green-500',
        cancelled: 'bg-red-500',
        unverified: 'bg-orange-500',
    }
    return <span className={`${statusColorConfig[status]} capitalize px-3 py-1 rounded-full text-xs`}>{status}</span>
}