import Note from "@/models/note.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/connectDB";
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { noteId, title, content, isCompleted } = await request.json();
    const currNote = await Note.findOne({ _id: noteId });
    if (!currNote) {
      return NextResponse.json({ error: "Note does not exist" });
    }
    currNote.title = title;
    currNote.content = content;
    currNote.isCompleted = isCompleted;
    const updatedNote = await currNote.save();
    return NextResponse.json(updatedNote);
  } catch (error) {
    return NextResponse.json({ error: "Cannot edit note: " + error });
  }
}
