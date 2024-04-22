const AcademicYear = require("../model/academicYear");
const Idea = require("../model/idea");
const fs = require("fs");
const archiver = require("archiver");

const createAcademicYear = async (academicYear) => {
  const { startDate, endDate, name, description } = academicYear;


  if (startDate === "" && endDate === "" && name === "") {
    throw new Error("StartDate, EndDate, Name and ClosureDate is required");
    return;
  }

  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    throw new Error("EndDate need after start date");
    return;
  }

  const checkAcademicYearExistedInDb = await AcademicYear.findOne({ name });
  if (checkAcademicYearExistedInDb) {
    throw new Error("AcademicYear Name already exists");
  } else {
    const createAcademic = new AcademicYear({ ...academicYear });
    await createAcademic.save();
    return createAcademic;
  }
};

const getAcademicYear = async () => {
  let result = await AcademicYear.find({});
  return result.filter((d) => !d.deleted);
};

const getAcademicYearById = async (id) => {
  const result = await AcademicYear.findById(id);
  if (!result) {
    throw new Error("Academic year does not exist");
  }
  return result;
};

const updateAcademicYear = async (id, academicYear) => {
  const { startDate, endDate, name, description } = academicYear;

  var academicYearDb = AcademicYear.findById(id);
  if (!academicYearDb) {
    throw new Error("Academic year does not exist");
    return;
  }

  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    throw new Error("EndDate need after start date");
    return;
  }

  const checkAcademicYearExistedInDb = await AcademicYear.findOne({ name })
    .where("_id")
    .ne(id);
  if (checkAcademicYearExistedInDb) {
    throw new Error("AcademicYear Name already exists");
    return;
  } else {
    await AcademicYear.findByIdAndUpdate(id, {
      startDate,
      endDate,
      name,
      description,
    });
  }
};

const archiveAllDocuments = async () => {
  const autoCreatedDocumentsOutput = fs.createWriteStream(
    __basedir + `/statics/archiver/auto-created-documents.zip`
  );
  const autoCreatedDocumentArchive = archiver("zip", {
    zlib: { level: 2 },
  });
  autoCreatedDocumentsOutput.on("end", function () {
    console.log("Data has been drained");
  });
  autoCreatedDocumentArchive.on("error", function (err) {
    throw err;
  });

  autoCreatedDocumentArchive.pipe(autoCreatedDocumentsOutput);

  autoCreatedDocumentArchive.directory(`${__basedir}/statics/documents`, false);

  await autoCreatedDocumentArchive.finalize();
};

const exportCsvFromDb = async () => {
  const allIdeaInDb = await Idea.find({ isAnonymous: false })

  const jsonToParse = allIdeaInDb.map((idea) => ({
    Title: idea.title,
    Description: idea.description,

    Comments: idea.comments.length,
    "Total Reactions": idea.reactions.length,
  }));
  return jsonToParse;
};

const anonymousIdeas = async () => {
  const ideaInDB = await Idea.find({ isAnonymous: true })
   
    .populate("user", "fullname username department");
  const jsonToParse = ideaInDB.map((idea) => ({
    Title: idea.title,
    Description: idea.description,
    Comments: idea.comments.length,
    "Total Reactions": idea.reactions.length,
    author: idea.user.fullname,
    username: idea.user.username,
    department: idea.user.department,
  }));
  return jsonToParse;
};

const anonymousComments = async () => {
  const allIdea = await Idea.find({}).populate({
    path: "comments",
    populate: {
      path: "user",
      model: "Users",
      select: "username fullname department",
    },
  });
  const allAnonymousComments = allIdea
    .map((idea) =>
      idea.comments
        .filter((comment) => comment.isAnonymous === true)
        .map((item) => ({
          Username: item.user.username,
          "Full name": item.user.fullname,
          Department: item.user.department,
          "Post ID": idea._id.toString(),
          "Post title": idea.title,
        }))
    )
    .flat();
  return allAnonymousComments;
};

const deleteAcademy = async (id) => {
  const updatedAcademy = await AcademicYear.findOneAndUpdate(
    { _id: id },
    {
      deleted: true,
    },
    { new: true }
  );
  return updatedAcademy;
};

module.exports = {
  createAcademicYear,
  getAcademicYear,
  getAcademicYearById,
  updateAcademicYear,
  archiveAllDocuments,
  exportCsvFromDb,
  deleteAcademy,
};
