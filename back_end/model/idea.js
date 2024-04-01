const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    reactionType: { type: String, enum: ["Like", "Dislike"] },
  },
  {
    timestamps: true,
  }
);
const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    content: { type: String, required: true },
    isAnonymous: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const IdeaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    documentLink: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    reactions: [ReactionSchema],
    comments: [CommentSchema],
    isAnonymous: { type: Boolean, default: false },
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
