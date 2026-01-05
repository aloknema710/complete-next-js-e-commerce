'use client'
import { CldUploadWidget } from 'next-cloudinary'
import React from 'react'
import { Button } from '../ui/button'
import { FiPlus } from 'react-icons/fi'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const UploadMedia = ({isMultiple}) => {
    const handleOnError = (error) =>{
        showToast('error', error.statustext)
    }
    // UploadMedia.jsx - Updated handleOnQueueEnd function
const handleOnQueueEnd = async (event) => {
    console.log("☁️ Cloudinary upload completed - Full event:", event);
    
    // Extract files from the correct structure
    const uploadedFiles = event.info.files
        .map(file => {
            // Check if file has uploadInfo (successful upload)
            if (file.uploadInfo && file.uploadInfo.public_id) {
                return {
                    asset_id: file.uploadInfo.asset_id,
                    public_id: file.uploadInfo.public_id,
                    secure_url: file.uploadInfo.secure_url,
                    path: file.uploadInfo.path,
                    thumbnail_url: file.uploadInfo.thumbnail_url,
                    format: file.uploadInfo.format,
                    resource_type: file.uploadInfo.resource_type,
                    bytes: file.uploadInfo.bytes,
                    width: file.uploadInfo.width,
                    height: file.uploadInfo.height
                };
            }
            return null;
        })
        .filter(file => file !== null); // Remove null entries

    console.log("📤 Processed files for DB:", uploadedFiles);

    if (uploadedFiles.length > 0) {
        try {
            console.log("🚀 Sending to backend...");
            const { data: mediaUploadResponse } = await axios.post('/api/media/create', uploadedFiles, {
                withCredentials: true
            });
            
            console.log("✅ Backend response:", mediaUploadResponse);
            
            if (mediaUploadResponse.success) {
                showToast('success', mediaUploadResponse.message);
                console.log("📊 Media saved to DB:", mediaUploadResponse.data);
                
                // Refresh to see the new media
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error(mediaUploadResponse.message);
            }
            
        } catch (error) {
            console.error("❌ Upload to backend failed:", error);
            const errorMessage = error.response?.data?.message || error.message;
            showToast('error', errorMessage);
        }
    } else {
        console.log("⚠️ No valid files to upload to database");
        showToast('warning', 'Files uploaded to Cloudinary but no valid data for database');
    }
};
  return (
    <CldUploadWidget 
        signatureEndpoint='/api/cloudinary-signature'
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPDATE_PRESET}
        onError={handleOnError}
        onQueuesEnd={handleOnQueueEnd}
        config={{
            cloud:{
                    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                }
            }}
        options={{
                multiple: isMultiple,
                sources: ['local','url','unsplash','google_drive']
            }}
        >
    
    {({ open }) => {
    return (
        <Button onClick={() =>open()}>
            <FiPlus/>
            Upload Media
        </Button>
    );
    }}
    </CldUploadWidget>
  )
}

export default UploadMedia