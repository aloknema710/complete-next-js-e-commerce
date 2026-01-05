// models/Media.model.js
import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    discountPercentage:{
        type: Number,
        required: true,
        trim: true
    },
    minShoppingAmount:{
        type: Number,
        required: true,
        trim: true
    },
    validity:{
        type: Date,
        required: true,
        // trim: true
    },
    deletedAt:{
        type: Date,
        default: null,
        index:true
    }
}, { 
    timestamps: true,
    // Remove strict mode temporarily for debugging
    // strict: false
});

// Add index for public_id if you want uniqueness
// couponSchema.index({ public_id: 1 }, { unique: true });

const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema, 'coupons');
export default CouponModel;
