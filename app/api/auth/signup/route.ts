import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import connectDB from "@/libs/connectDB";
import { sendEmail } from "@/libs/nodemailer";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password, name } = await request.json();

    const currUser = await userModel.findOne({ email });
    if (currUser) {
      return NextResponse.json(
        { error: "Email already in use for an existing account" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await userModel.create({
      email,
      name,
      password: hashedPassword,
      provider: "credentials",
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("User registered successfully: ", newUser._id);
    }

    await sendEmail({ email, mailType: "VERIFY" });

    if (process.env.NODE_ENV !== "production") {
      console.log("Verification email sent to:", email);
    }

    return NextResponse.json({
      message: "User registered successfully, verification email sent.",
      success: true,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Signup error:", error);
    }
    return NextResponse.json(
      { error: "There was an error while registering. Please try again." },
      { status: 500 }
    );
  }
}
