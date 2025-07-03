import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/connectDB";
connectDB();
export async function GET(request: NextRequest) {
  try {
    const { email } = await request.json();
    const currUser = await userModel.findOne({ email }).populate("notes"); // finds user by email and returns an array of all notes which can be accessed by currUser.notes
    if (!currUser) {
      return NextResponse.json({
        error: "Cant fetch notes since user not found",
      });
    }

    return NextResponse.json(currUser.notes);
  } catch (error) {
    return NextResponse.json({ error: `Could not fetch notes: ${error}` });
  }
}
