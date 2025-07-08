import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import connectDB from "@/libs/connectDB";
import { sendEmail } from "@/libs/nodemailer";
import Note from "@/models/note.model";
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password, name } = await request.json();

    const currUser = await userModel.findOne({ email });
    if (currUser) {
      return NextResponse.json({
        error: "Email already in use for an existing account",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await userModel.create({
      email,
      name,
      password: hashedPassword,
      provider: "credentials",
    });

    console.log("User registered successfully: ", newUser);

    // await Note.create({
    //   email,
    //   title: "Welcome To Notesify",
    //   content: "This is your welcome note, edit or delete it anytime!",
    // });

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
