import fs from 'fs'
import path from 'path'
import Resume from '../models/resumeModel.js'
import upload from '../middleware/uploadMiddleware.js'

export const uploadResumeImage=async(req,res)=>{
    try{
        //configure multer to handle images
        upload.fields([{name:"thumbnail"},{name:"profileImage"}])
        (req,res,async(err)=>{
            if(err){
                return res.status(400).json({message:"File upload failed",error:err.message});
            }

            const resumeId=req.params.id;
            const resume=await Resume.findOne({_id:resumeId,userId:req.user.id})
            if(!resume){
                return res.status(400).json({message:"Resume not found or unauthorized",error:err.message});
            }

            // use process cwd to locate uploads folder
            const uploadFolder=path.join(process.cwd(),"uploads")
            const baseUrl=`${req.protocol}://${req.get("host")}`;

            const newThumbnail=req.files.thumbnail?.[0];
            const newProfileImage=req.files.profileImage?.[0];

            if(newThumbnail){
                if(resume.thumbnailLink){
                    const oldThumbnail=path.join(uploadFolder,path.basename(resume.thumbnailLink))
                    if(fs.existsSync(oldThumbnail)){
                        await fs.promises.unlink(oldThumbnail)

                    }
                }
                resume.thumbnailLink=`${baseUrl}/uploads/${newThumbnail.filename}`;
            }

            // same for profilePreview image
            if(newProfileImage){
                if(resume.profileInfo?.profilePreviewUrl){
                    const oldProfile=path.join(uploadsFolder,path.basename(resume.profileInfo.profilePreviewUrl))
                    if(fs.existsSync(oldProfile)){
                        await fs.promises.unlink(oldProfile)
                    }
                }
                resume.profileInfo.profilePreviewUrl=`${baseUrl}/uploads/${newProfileImage.filename}`;
            }
            await resume.save();
            res.status(200).json({
                message: "Images uploaded successfully",
                thumbnailLink: resume.thumbnailLink,
                profilePreviewUrl: resume.profileInfo.profilePreviewUrl
            })
        })
    }
    catch(err){
        console.error('error uploading images: ',err);
        res.status(500).json({
            message:"Failed to upload images",
            error:err.message
        })
    }
}