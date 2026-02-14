import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/libs/connectDB";
import Note from "@/models/note.model";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const {
      email,
      folderId,
      tagId,
      includeArchived,
      includeTrashed,
      pinnedOnly,
      completedOnly,
    } = await request.json();

    const currUser = await userModel.findOne({ email });
    if (!currUser) {
      return NextResponse.json(
        {
          error: "Can't fetch notes since user not found",
        },
        { status: 404 },
      );
    }

    // Build query
    const query: Record<string, unknown> = {
      createdBy: currUser._id,
      isTrashed: includeTrashed ? true : false,
    };

    // Only include archived if specifically requested
    if (!includeArchived) {
      query.isArchived = false;
    }

    // Filter by folder
    if (folderId) {
      query.folder = folderId;
    }

    // Filter by tag
    if (tagId) {
      query.tags = tagId;
    }

    // Filter pinned only
    if (pinnedOnly) {
      query.isPinned = true;
    }

    // Filter completed only
    if (completedOnly) {
      query.isCompleted = true;
    }

    const notes = await Note.find(query)
      .populate("tags")
      .populate("folder")
      .sort({ isPinned: -1, updatedAt: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json(
      { error: `Could not fetch notes: ${error}` },
      { status: 500 },
    );
  }
}
