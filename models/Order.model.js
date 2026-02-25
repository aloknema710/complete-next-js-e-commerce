import { orderStatus } from "@/lib/utils";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    pincode: {
        type: String,
        required: false
    },
    landmark: {
        type: String,
        required: false
    },
    ordernote: {
        type: String,
        required: false
    },
    products: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
            variantId: {type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true},
            name: {type: String, required: true},
            qty: {type: Number, required: true},
            mrp: {type: Number, required: true},
            sellingPrice: {type: Number, required: true},
        }
    ],
    // subtotal: {
    //     type: Number,
    //     required: true
    // },
    discount:{
        type: Number,
        required: true
    },
    couponDiscountAmount:{
        type: Number,
        required: true
    },
    totalAmount:{
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: orderStatus,
        default: 'pending'
    }, 
    payment_id: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    deletedAt:{
        type: Date,
        default: null,
        index: true
    }
})

const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema, 'orders')
export default OrderModel