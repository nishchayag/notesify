import connectDB from "@/libs/connectDB";
import Note from "@/models/note.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

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
      email,
      title,
      content,
      folder,
      tags,
      color,
      icon,
      coverImage,
      isPinned,
    } = await request.json();

    const currUser = await userModel.findOne({ email });

    if (!email || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    if (!currUser) {
      return NextResponse.json(
        {
          error: "User does not exist, please enter correct email",
        },
        { status: 404 },
      );
    }

    const plainText = extractPlainText(content);

    const newNote = await Note.create({
      title,
      content,
      plainText,
      isCompleted: false,
      isPinned: isPinned || false,
      folder: folder || null,
      tags: tags || [],
      color: color || null,
      icon: icon || null,
      coverImage: coverImage || null,
      createdBy: currUser._id,
    });

    await currUser.notes.push(newNote._id);
    await currUser.save();

    // Populate tags and folder before returning
    const populatedNote = await Note.findById(newNote._id)
      .populate("tags")
      .populate("folder");

    return NextResponse.json(
      {
        message: "Note created successfully",
        note: populatedNote,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: `Could not create a new note: ${error}`,
      },
      { status: 500 },
    );
  }
}
