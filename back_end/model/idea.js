const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);
const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    content: { type: String, required: true },
  
  },
  {
    timestamps: true,
  }
);

const IdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
   
    documentLink: [{ type: String }],
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    reactions: [ReactionSchema],
    comments: [CommentSchema],
    
    isApprove: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    department: { type: String, required: true },
    academy: {
      type: mongoose.Types.ObjectId,
      ref: "AcademicYear",
      required: false,
    },
    magazine: {
      type: mongoose.Types.ObjectId,
      ref: "Magazine",
      required: false,
    },
  },
  { timestamps: true }
);

const IdeaModel = mongoose.model("Ideas", IdeaSchema);

module.exports = IdeaModel;
