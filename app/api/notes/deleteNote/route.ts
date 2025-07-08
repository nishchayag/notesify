import connectDB from "@/libs/connectDB";
import Note from "@/models/note.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
//api to delete a note
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { noteId, email } = await request.json();
    if (!noteId) {
      return NextResponse.json({ message: "Please provide note-id" });
    }
    const currNote = await Note.findOne({ _id: noteId });
    if (!currNote) {
      return NextResponse.json({ error: "Note not found" });
    }
    await Note.deleteOne({ _id: noteId });
    await userModel.findOneAndUpdate(
      { email },
      {
        $pull: { notes: noteId },
      }
    );
    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    return NextResponse.json({
      error: "Could not delete note from DB: " + error,
    });
  }
}
