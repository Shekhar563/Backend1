import {v2 as cloudinary} from 'cloudinary'
import fs   from 'fs'
import dotenv from 'dotenv'
dotenv.config({
        path: './.env'
})

cloudinary.config({
        cloud_name: process.env.CLOUINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
})

const UploadOnCloudinary = async(localFilePath)=>{
        try {
                if(!localFilePath) return null
                const response = await cloudinary.uploader.upload(localFilePath, {
                        resource_type: "auto",
                })
                fs.unlinkSync(localFilePath)
                return response    
        } catch (error) {
                console.error("Cloudinary upload error:", error);
                return null
                fs.unlinkSync(localFilePath)
        }
}
export {
        UploadOnCloudinary
}