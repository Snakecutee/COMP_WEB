const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    maxlength: 50,
  },
  description: {
    type: String,
    require: true,
  },
  startDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const AcademicYearModel = mongoose.model("AcademicYear", academicYearSchema);

module.exports = AcademicYearModel;
