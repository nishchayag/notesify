import connectDB from "@/libs/connectDB";
import Folder from "@/models/folder.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch all folders for a user
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

    const folders = await Folder.find({ createdBy: user._id }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(folders);
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch folders: ${error}` }, { status: 500 });
  }
}

// POST - Create a new folder
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, name, icon, color, parentFolder } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const folder = await Folder.create({
      name,
      icon: icon || "📁",
      color: color || "#6366f1",
      parentFolder: parentFolder || null,
      createdBy: user._id,
    });

    user.folders.push(folder._id);
    await user.save();

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Failed to create folder: ${error}` }, { status: 500 });
  }
}

// PUT - Update a folder
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { folderId, name, icon, color, parentFolder, order } = await request.json();

    if (!folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (parentFolder !== undefined) updateData.parentFolder = parentFolder;
    if (order !== undefined) updateData.order = order;

    const folder = await Folder.findByIdAndUpdate(folderId, updateData, { new: true });

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    return NextResponse.json(folder);
  } catch (error) {
    return NextResponse.json({ error: `Failed to update folder: ${error}` }, { status: 500 });
  }
}

// DELETE - Delete a folder
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { folderId, email } = await request.json();

    if (!folderId || !email) {
      return NextResponse.json({ error: "Folder ID and email are required" }, { status: 400 });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the folder
    const folder = await Folder.findByIdAndDelete(folderId);
    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Remove from user's folders array
    user.folders = user.folders.filter((f: mongoose.Types.ObjectId) => f.toString() !== folderId);
    await user.save();

    // Update notes in this folder to have no folder
    const Note = (await import("@/models/note.model")).default;
    await Note.updateMany({ folder: folderId }, { folder: null });

    // Delete child folders recursively
    await Folder.deleteMany({ parentFolder: folderId });

    return NextResponse.json({ message: "Folder deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete folder: ${error}` }, { status: 500 });
  }
}

import mongoose from "mongoose";
