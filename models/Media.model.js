// models/Media.model.js
import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    asset_id: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    secure_url: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    thumbnail_url: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    alt:{
        type: String,
        trim: true
    },
    title:{
        type: String,
        trim: true
    },
    deletedAt:{
        type: Date,
        default: null,
        index:true
    }
}, { 
    timestamps: true,
    // Remove strict mode temporarily for debugging
    strict: false
});

// Add index for public_id if you want uniqueness
mediaSchema.index({ public_id: 1 }, { unique: true });

const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaSchema, 'media');
export default MediaModel;



// import mongoose from "mongoose";


// const mediaSchema = new mongoose.Schema({
//     asset_id:{
//         type: String,
//         required: true,
//         trim: true
//     },
//     public_id:{
//         type: String,
//         required: true,
//         trim: true
//     },
//     path:{
//         type: String,
//         required: true,
//         trim: true
//     },
//     thumbnail_url:{
//         type: String,
//         required: true,
//         trim: true
//     },
//     alt:{
//         type: String,
//         trim: true
//     },
//     title:{
//         type: String,
//         trim: true
//     },
//     deletedAt:{
//         type: Date,
//         default: null,
//         index:true
//     }
// },{ timestamps: true })

// const MediaModel = mongoose.models.Media || mongoose.model('Media', mediaSchema, 'medias')
// export default MediaModel