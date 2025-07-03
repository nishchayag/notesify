import connectDB from "@/libs/connectDB";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
await connectDB();
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      console.error("Error while verification, no token provided");
      return NextResponse.json({ error: "No token provided" });
    }
    console.log(token);
    const currUser = await userModel.findOneAndUpdate(
      {
        verifyToken: token,
        verifyTokenExpiry: { $gt: Date.now() },
      },
      {
        $set: { isVerified: true },
        $unset: { verifyToken: 1, verifyTokenExpiry: 1 },
      },
      { new: true }
    );
    if (!currUser) {
      return NextResponse.json({ error: "Invalid token" });
    }
    console.log("User verified successfully: ", currUser);
    return NextResponse.json({ message: "User verified successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Could not verify User: " + error });
  }
}
