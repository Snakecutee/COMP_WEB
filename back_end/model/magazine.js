const mongoose = require("mongoose");

const magazineSchema = new mongoose.Schema(
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
    department: { type: mongoose.Types.ObjectId, ref: "Department" },
    academy: { type: mongoose.Types.ObjectId, ref: "AcademicYear" },
    startDate: {
      type: Date,
      require: true,
    },
    endDate: {
      type: Date,
      require: true,
    },

    closureDate: {
      type: Date,
      require: true,
    },
    isDelete: {
      type: Boolean,
      require: true,
    },
  },
  { timestamps: true }
);

const MagazineModel = mongoose.model("Magazine", magazineSchema);

module.exports = MagazineModel;
