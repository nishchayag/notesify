import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#6366f1", // Default indigo
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Ensure unique tag names per user
tagSchema.index({ createdBy: 1, name: 1 }, { unique: true });

export default mongoose.models.Tag || mongoose.model("Tag", tagSchema);
