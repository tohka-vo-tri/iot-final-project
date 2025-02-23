import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB url la ?',process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
