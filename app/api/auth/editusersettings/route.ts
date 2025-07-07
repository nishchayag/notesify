import connectDB from "@/libs/connectDB";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, name, password } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Please provide an email" });
    }
    const userInDB = await userModel.findOne({ email });
    if (!userInDB) {
      return NextResponse.json({
        error: "User not found, please provide a valid email",
      });
    }
    if (name.length != 0) {
      userInDB.name = name;
    }
    if (password.length != 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userInDB.password = hashedPassword;
    }
    userInDB.save();
    return NextResponse.json({ message: "User settings edited successfully" });
  } catch (error) {
    return NextResponse.json({ error: "could not change details" });
  }
}
