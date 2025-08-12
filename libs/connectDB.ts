import mongoose from "mongoose";

// Environment validation
const requiredEnvVars = ['MONGO_URI', 'NEXTAUTH_SECRET', 'RESEND_API_KEY', 'DOMAIN'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  }
}

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("Please provide mongodb connection string in env file");
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;
if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    try {
      cached.promise = mongoose.connect(MONGO_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      if (process.env.NODE_ENV !== "production") {
        console.log("Attempting to connect to MongoDB...");
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error connecting to DB: ", error);
      }
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB connected successfully");
    }
    return cached.conn;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("MongoDB connection failed: ", error);
    }
    throw error;
  }
}
