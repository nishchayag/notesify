import connectDB from "@/libs/connectDB";
import Note from "@/models/note.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, title, content } = await request.json();
    const currUser = await userModel.findOne({ email });
    if (!email || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" });
    }
    if (!currUser) {
      return NextResponse.json({
        error: "User does not exist, please enter correct email",
      });
    }
    const newNote = await Note.create({
      title,
      content,
      isCompleted: false,
      createdBy: currUser._id,
    });
    await currUser.notes.push(newNote._id);
    await currUser.save();
    return NextResponse.json({
      message: `Note created Successfully: ${newNote} `,
    });
  } catch (error) {
    return NextResponse.json({
      error: `Could not create a new note: ${error}`,
    });
  }
}
