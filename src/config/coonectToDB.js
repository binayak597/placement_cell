import mongoose from "mongoose";

export const connectToDB = async () => {

    try {
        const client = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`DB is connected: ${client.connection.host}`);
    } catch (error) {
        
        console.error("Errror while connecting to MONGODB ", error.message);
        process.exit(1);
    }

}