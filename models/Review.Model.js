// models/Media.model.js
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    title:{
        type: String,
        required: true
    },
    review:{
        type: String,
        required: true
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
// ReviewSchema.index({ public_id: 1 }, { unique: true });

const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema, 'review');
export default ReviewModel;
