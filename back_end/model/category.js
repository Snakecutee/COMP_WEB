const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      maxlength: 50,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    ideas: [{ type: mongoose.Types.ObjectId, ref: "Ideas" }],
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
