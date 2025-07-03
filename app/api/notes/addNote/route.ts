import connectDB from "@/libs/connectDB";
import noteModel from "@/models/note.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
connectDB();
export default async function POST(request: NextRequest) {
  try {
    const { email, title, content } = await request.json();
    const currUser = await userModel.findOne({ email });
    if (!currUser) {
      console.error("User does not exist, please enter correct email");
    }
    const newNote = await noteModel.create({
      title,
      content,
      isCompleted: false,
      createdBy: currUser._id,
    });
    await currUser.notes.push(newNote._id);
    const updatedUser = await currUser.save();
    return NextResponse.json({
      message: `Note created Successfully: ${updatedUser}`,
    });
  } catch (error) {
    return NextResponse.json({
      error: `Could not create a new note: ${error}`,
    });
  }
}
