import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "📁",
    },
    color: {
      type: String,
      default: "#6366f1", // Default indigo
    },
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
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

// Index for efficient querying
folderSchema.index({ createdBy: 1, parentFolder: 1 });
folderSchema.index({ createdBy: 1, order: 1 });

export default mongoose.models.Folder || mongoose.model("Folder", folderSchema);
