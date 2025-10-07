export const BASE_URL='http://localhost:5000'

// routes used for frontend
export const API_PATHS={
    AUTH:{
        REGISTER:'/api/auth/register',
        LOGIN:'/api/auth/login',
        PROFILE:'/api/auth/profile',
    },
    RESUME:{
        CREATE:'/api/resume',
        GET_ALL:'/api/resume',
        GET_BY_ID:(id)=> `/api/resume${id}`,

        UPDATE:(id)=> `/api/resume${id}`,
        DELETE:(id)=> `/api/resume${id}`,
        ULPOAD_IMAGES:(id)=> `/api/resume${id}/upload-images`,
    },
    image:{
        UPLOAD_IMAGE:'api/auth/upload-image',
    }

}