import connectDB from "@/libs/connectDB";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
await connectDB();
export default async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      console.error("Error while verification, no token provided");
      return NextResponse.json({ error: "No token provided" });
    }
    const currUser = await userModel.findOneAndUpdate(
      {
        token,
        verifyTokenExpiry: { $gt: Date.now() },
      },
      { isVerified: true, verifyToken: undefined, verifyTokenExpiry: undefined }
    );
    if (!currUser) {
      console.error("Invalid Token ");
      return NextResponse.json({ error: "Invalid token" });
    }
    console.log("User verified successfully: ", currUser);
    return NextResponse.json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Cannot verify: ", error);
  }
}
