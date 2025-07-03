import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import connectDB from "@/libs/connectDB";
import { sendEmail } from "@/libs/nodemailer";
await connectDB();
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const currUser = await userModel.findOne({ email });
    if (currUser) {
      return NextResponse.json({
        error: "Email already in use for an existing account",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await userModel.create({ email, password: hashedPassword });
    console.log("User registered successfully: ", newUser);
    sendEmail({ email, mailType: "VERIFY" });
    console.log("verification email sent");
    return NextResponse.json({
      message: "User registered successfully, verification email sent.",
    });
  } catch (error) {
    return NextResponse.json({
      error: "There was an error while registering: " + error,
    });
  }
}
