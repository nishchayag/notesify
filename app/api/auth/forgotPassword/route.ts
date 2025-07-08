import { sendEmail } from "@/libs/nodemailer";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/connectDB";
import userModel from "@/models/user.model";
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Please provide email" });
    }
    const userInDB = await userModel.findOne({ email });
    if (!userInDB) {
      return NextResponse.json({
        error: "Email is not associated with an account",
      });
    }
    sendEmail({ email, mailType: "RESET" });
    return NextResponse.json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error sending password reset email" + error,
    });
  }
}
