import connectDB from "@/libs/connectDB";
import noteModel from "@/models/note.model";
import { NextRequest, NextResponse } from "next/server";
connectDB();
//api to delete a note
export async function POST(request: NextRequest) {
  try {
    const { noteId } = await request.json();
    if (!noteId) {
      return NextResponse.json({ message: "Please provide note-id" });
    }
    const currNote = await noteModel.findOne({ _id: noteId });
    if (!currNote) {
      return NextResponse.json({ error: "Note not found" });
    }
    await noteModel.deleteOne({ _id: noteId });
    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {}
}
