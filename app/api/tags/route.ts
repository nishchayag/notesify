import connectDB from "@/libs/connectDB";
import Tag from "@/models/tag.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// GET - Fetch all tags for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const email = request.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tags = await Tag.find({ createdBy: user._id }).sort({ name: 1 });
    return NextResponse.json(tags);
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch tags: ${error}` }, { status: 500 });
  }
}

// POST - Create a new tag
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, name, color } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if tag already exists for this user
    const existingTag = await Tag.findOne({ createdBy: user._id, name: name.toLowerCase() });
    if (existingTag) {
      return NextResponse.json({ error: "Tag already exists" }, { status: 400 });
    }

    const tag = await Tag.create({
      name: name.toLowerCase(),
      color: color || "#6366f1",
      createdBy: user._id,
    });

    user.tags.push(tag._id);
    await user.save();

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to create tag: ${error}` }, { status: 500 });
  }
}

// PUT - Update a tag
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { tagId, name, color } = await request.json();

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.toLowerCase();
    if (color !== undefined) updateData.color = color;

    const tag = await Tag.findByIdAndUpdate(tagId, updateData, { new: true });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: `Failed to update tag: ${error}` }, { status: 500 });
  }
}

// DELETE - Delete a tag
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { tagId, email } = await request.json();

    if (!tagId || !email) {
      return NextResponse.json({ error: "Tag ID and email are required" }, { status: 400 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the tag
    const tag = await Tag.findByIdAndDelete(tagId);
    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Remove from user's tags array
    user.tags = user.tags.filter((t: mongoose.Types.ObjectId) => t.toString() !== tagId);
    await user.save();

    // Remove tag from all notes
    const Note = (await import("@/models/note.model")).default;
    await Note.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete tag: ${error}` }, { status: 500 });
  }
}
