import Note from "@/models/note.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/connectDB";

// Helper function to extract plain text from HTML
function extractPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const {
      noteId,
      title,
      content,
      isCompleted,
      isPinned,
      isArchived,
      isTrashed,
      folder,
      tags,
      color,
      icon,
      coverImage,
    } = await request.json();

    const currNote = await Note.findOne({ _id: noteId });
    if (!currNote) {
      return NextResponse.json(
        { error: "Note does not exist" },
        { status: 404 },
      );
    }

    // Update fields if provided
    if (title !== undefined) currNote.title = title;
    if (content !== undefined) {
      currNote.content = content;
      currNote.plainText = extractPlainText(content);
    }
    if (isCompleted !== undefined) currNote.isCompleted = isCompleted;
    if (isPinned !== undefined) currNote.isPinned = isPinned;
    if (isArchived !== undefined) currNote.isArchived = isArchived;
    if (isTrashed !== undefined) {
      currNote.isTrashed = isTrashed;
      currNote.trashedAt = isTrashed ? new Date() : null;
    }
    if (folder !== undefined) currNote.folder = folder;
    if (tags !== undefined) currNote.tags = tags;
    if (color !== undefined) currNote.color = color;
    if (icon !== undefined) currNote.icon = icon;
    if (coverImage !== undefined) currNote.coverImage = coverImage;

    const updatedNote = await currNote.save();

    // Populate tags and folder before returning
    const populatedNote = await Note.findById(updatedNote._id)
      .populate("tags")
      .populate("folder");

    return NextResponse.json(populatedNote);
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot edit note: " + error },
      { status: 500 },
    );
  }
}
