import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("Please provide mongodb connection string in env file");
}
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(MONGO_URI, { bufferCommands: false });
    } catch (error) {
      console.error("Error connecting to DB: ", error);
    }
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
