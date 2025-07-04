import mongoose from "mongoose";
let isConnected = false;
export default async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("successfully connected to DB");
    });
    connection.on("error", (error) => {
      console.error("DB connection error, make sure DB is running: ", error);
      process.exit(1);
    });
  } catch (error) {
    console.error("Error connecting to DB: ", error);
  }
}
