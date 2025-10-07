import Resume from "../models/resumeModel.js";
import fs from 'fs'
import path from 'path'


export const createResume=async(req,res)=>{
    try{
        const {title}=req.body;

        // default template
        const defaultResumeData = {
            profileInfo: {
                profileImg: null,
                previewUrl: '',
                fullName: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skills: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certifications: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            languages: [
                {
                    name: '',
                    progress: '',
                },
            ],
            interests: [''],
        };

        const newResume=await Resume.create({
            userId:req.user.id,
            title,
            ...defaultResumeData,
            ...req.body
        })
        res.status(201).json(newResume)
    }
    catch(error){
        res.status(500).json({message:"Failed to create resume",error:error.message})
    }
}


/// get function
export const getUserResumes=async(req,res)=>{
    try{
        const resumes=await Resume.find({userId:req.user.id}).sort({
            updateAt:-1
        })
        res.json(resumes)
    }
    catch(error){
        res.status(500).json({message:"Failed to get resume",error:error.message})
    }
}

// get resume by id
export const getResumeById=async(req,res)=>{
    try{
        const resume=await Resume.findOne({_id:req.params.id,userId:req.user.id})
        if(!resume){
            return res.status(404).json({message:"Resume not found"})
        }
        res.json(resume)
    }
    catch(error){
        res.status(500).json({message:"Failed to get resume",error:error.message})
    }
}

// update resumes
export const updateResume=async(req,res)=>{
    try{
        const resume=await Resume.findOne({
            id:req.params.id,
            userId:req.user.id,
        })
        if(!resume){
            return res.status(404).json({message:"Resume not found or not authorized"});
        }

        // merge updated resumes
        Object.assign(resume,req.body)
        // saving updates resume
        const savedResume=await resume.save();
        res.json(savedResume)
    }
    catch(error){
        res.status(500).json({message:"Failed to update resume",error:error.message})
    }
}

/// delete resume
export const deleteResume=async (req,res)=>{
    try{
        const resume=await Resume.findOne({
            id:req.params.id,
            userId:req.user.id,
        })
        if(!resume){
            return res.status(404).json({message:"Resume not found or not authorized"});
        }

        // create a upload folder and store resume there
        const uploadFolder=path.join(process.cwd(),'uploads')

        // delete thumbnail function
        if(resume.thumbnailLink){
            const oldThumbnail=path.join(uploadFolder,path.basename(resume.thumbnailLink))
            if(fs.existsSync(oldThumbnail)){
                await fs.promises.unlink(oldThumbnail)
            }
        }

        if(resume.profileInfo?.profilePreviewUrl){
            const oldProfile=path.join(
                uploadFolder,
                path.basename(resume.profileInfo.profilePreviewUrl)
            )
            if(fs.existsSync(oldProfile)){
                fs.unlink(oldProfile)
            }
        }

        // delete resume doc
        const deleted=await Resume.findOneAndDelete({
            id:req.params.id,
            userId:req.user.id,
        })
        if(!deleted){
           return res.status(404).json({message:"Resume not found or not authorized"}); 
        }
        res.json({message:"Resume deleted successfully"})
    }
    catch(error){
        return res.status(500).json({message:"Failed to delete resume",error:error.message});
    }
}
