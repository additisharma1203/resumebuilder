import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://additisharma0312:resume@cluster0.09xjjbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>console.log('DB CONNECTED'))
}