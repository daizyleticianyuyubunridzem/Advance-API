import mongoose from "mongoose";

const connectDB = async (): Promise <void> => {
    try{
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log("Connected to database");

    }catch(error){
        console.error("Database connection Failed", error);
        process.exit(1)
    }
};

export default connectDB;
