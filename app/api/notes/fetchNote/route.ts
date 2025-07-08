import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/connectDB";
import Note from "@/models/note.model";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { noteId } = await request.json();
    if (!noteId) {
      return NextResponse.json({ error: "Please provide note id" });
    }
    const noteInDB = await Note.findOne({ _id: noteId });
    if (!noteInDB) {
      return NextResponse.json({
        error: "Note not found in DB",
      });
    }
    return NextResponse.json(noteInDB);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching the note: " + error });
  }
}
