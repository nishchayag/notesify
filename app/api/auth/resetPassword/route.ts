import connectDB from "@/libs/connectDB";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({
        error: "Please provide token and new password",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userInDB = await userModel.findOneAndUpdate(
      {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      },
      {
        $set: { password: hashedPassword },
        $unset: { forgotPasswordToken: 1, forgotPasswordTokenExpiry: 1 },
      },
      { new: true }
    );
    if (!userInDB) {
      return NextResponse.json({
        error: "Email is not associated with an account, please signup",
      });
    }
    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    return NextResponse.json({
      error: "Error resetting password: " + error,
    });
  }
}
