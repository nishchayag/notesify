import mongoose from "mongoose";
import "./user.model";
import "./folder.model";
import "./tag.model";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    plainText: {
      type: String,
      default: "", // For full-text search
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    trashedAt: {
      type: Date,
      default: null,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    color: {
      type: String,
      default: null, // Note background color
    },
    icon: {
      type: String,
      default: null, // Note emoji icon
    },
    coverImage: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Indexes for efficient querying
noteSchema.index({ createdBy: 1, isTrashed: 1, isArchived: 1 });
noteSchema.index({ createdBy: 1, folder: 1 });
noteSchema.index({ createdBy: 1, tags: 1 });
noteSchema.index({ createdBy: 1, isPinned: -1, updatedAt: -1 });
noteSchema.index({ plainText: "text", title: "text" }); // Text search index

export default mongoose.models.Note || mongoose.model("Note", noteSchema);
