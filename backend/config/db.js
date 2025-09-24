import mongoose from 'mongoose';

let connectDB = async() => {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error in Connection : ${error.message}`)
        process.exit(1);
    }
}

export default connectDB;