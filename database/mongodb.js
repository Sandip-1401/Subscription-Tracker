import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
   throw new Error(`Please defind MONGODB_URI environment variable`)
}

const connectToDatabase = async () => {
   try {
      await mongoose.connect(DB_URI);
   } catch (error) {
      process.exit(1);
   }
}

export default connectToDatabase;