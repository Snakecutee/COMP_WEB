const AcademicYear = require("../model/academicYear");
const MagazineModel = require("../model/magazine");
const Department = require("../model/department");

const createMagazine = async (magazine) => {
  const { startDate, endDate, name, description, department, academy } =
    magazine;

  if (startDate === "" && endDate === "" && name === "" && closureDate === "") {
    throw new Error("StartDate, EndDate, Name and ClosureDate is required");
    return;
  }

  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    throw new Error("EndDate need after start date");
    return;
  }
  const academyInDb = await AcademicYear.findOne({ name: academy });
  const departmentInDb = await Department.findOne({ name: department });

  const createMagazine = new MagazineModel({
    ...magazine,
    academy: academyInDb._id,
    department: departmentInDb._id,
    isDelete: false,
  });
  await createMagazine.save();
  return createMagazine;
};

const updateMagazine = async (magazine) => {
  const { id, startDate, endDate, name, description, department, academy } =
    magazine;
  console.log("magazine", magazine);
  if (
    !startDate ||
    !endDate ||
    !name ||
    !description ||
    !department ||
    !academy
  ) {
    throw new Error(
      "All fields (StartDate, EndDate, Name, Description, Department, Academy) are required"
    );
  }

  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    throw new Error("EndDate must be after StartDate");
  }

  const academyInDb = await AcademicYear.findOne({ name: academy });
  if (!academyInDb) {
    throw new Error(`Academy with name ${academy} not found`);
  }

  const departmentInDb = await Department.findOne({ name: department });
  if (!departmentInDb) {
    throw new Error(`Department with name ${department} not found`);
  }

  const updatedMagazine = await MagazineModel.findOneAndUpdate(
    { _id: id },
    {
      startDate: startDate,
      endDate: endDate,
      name: name,
      description: description,
      department: departmentInDb._id,
      academy: academyInDb._id,
    },
    { new: true }
  );

  if (!updatedMagazine) {
    throw new Error(`Magazine with ID ${_id} not found`);
  }

  return updatedMagazine;
};

const getById = async (id) => {
  const magazine = await MagazineModel.findById(id)
    .populate("department")
    .populate("academy")
    .populate("ideas");
  return magazine;
};

const getAllMagazine = async () => {
  const magazines = await MagazineModel.find()
    .populate("department")
    .populate("academy")
    .populate("ideas");
  const filteredMagazines = magazines
    .filter((magazine) => magazine.department !== null)
    .filter((magazine) => magazine.isDelete === false);

  return filteredMagazines.filter((d) => !d.deleted);
};

const getAllMagazineFilterDepartment = async (department) => {
  const magazines = await MagazineModel.find()
    .populate({
      path: "department",
      match: { name: department },
    })
    .populate("academy")
    .populate("ideas");
  const filteredMagazines = magazines
    .filter((magazine) => magazine.department !== null)
    .filter((magazine) => magazine.isDelete === false);

  return filteredMagazines.filter((d) => !d.deleted);
};

const deleteMagazine = async (id) => {
  const updatedMagazine = await MagazineModel.findOneAndUpdate(
    { _id: id },
    {
      isDelete: true,
    },
    { new: true }
  );
  return updatedMagazine;
};

module.exports = {
  createMagazine,
  updateMagazine,
  getAllMagazineFilterDepartment,
  deleteMagazine,
  getAllMagazine,
  getById,
};
