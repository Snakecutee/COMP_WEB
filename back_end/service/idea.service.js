const IdeaModel = require("../model/idea");

const UserModel = require("../model/user");
const DepartmentModel = require("../model/department");
const AcademicYear = require("../model/academicYear");
const fs = require("fs");
const { uploadDocument } = require("../processes/cloudinary");
const MagazineModel = require("../model/magazine");

const filterEnum = {
  VIEW: "VIEW",
  ALPHABET: "ALPHABET",
  // LIKE: "LIKE",
  // DISLIKE: "DISLIKE",
  POPULAR: "POPULAR",
  DATE_ASC: "DATE_ASC",
  DATE_DESC: "DATE_DESC",
  MY_IDEA: "MY_IDEA",
  APPROVE: "APPROVE",
  END_DATE: "END_DATE",
};

const getAllIdeaWithFilter = async (
  id,
  filter = filterEnum.ALPHABET,
  page = 1,
  limit = 5
) => {
  switch (filter) {
    case filterEnum.END_DATE:
      const allIdeaEndDate = await IdeaModel.find({})
       
        .populate("magazine")
        .populate("academy", "name")
        .populate("user")
        .sort({ viewCount: -1 });
      console.log("dsaasd");
      return allIdeaEndDate
        .filter((idea) => new Date(idea.magazine.endDate) < new Date())
        .slice((page - 1) * limit, page * limit);
    case filterEnum.VIEW:
      return (allIdeaInDB = await IdeaModel.find({})
       
        .populate("magazine")
        .populate("academy", "name")
        .populate("user")
        .sort({ viewCount: -1 })
        .skip((page - 1) * limit)
        .limit(limit));
    case filterEnum.ALPHABET:
      return (allIdeaInDB = await IdeaModel.find({})
      
        .populate("magazine")
        .populate("academy", "name")
        .populate("user")
        .sort({ title: 1 })
        .skip((page - 1) * limit)
        .limit(limit));
   
    case filterEnum.DATE_ASC:
      return (allIdeaInDB = await IdeaModel.find({})
       
        .populate("magazine")
        .populate("academy", "name")
        .populate("user")
        .populate("user")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit));
    case filterEnum.DATE_DESC:
      return (allIdeaInDB = await IdeaModel.find({})
       
        .populate("magazine")
        .populate("academy", "name")
        .populate("user")
        .populate("user")
        .sort({
          createdAt: 1,
        })
        .skip((page - 1) * limit)
        .limit(limit));
    case filterEnum.MY_IDEA:
      return (allIdeaInDB = await IdeaModel.find({ user: id })
     
        .populate("magazine")
        .populate("academy", "name")
        .populate("user")
        .sort({
          createdAt: 1,
        })
        .skip((page - 1) * limit)
        .limit(limit));
    case filterEnum.APPROVE:
      return (allIdeaInDB = await IdeaModel.find({ isApprove: false })
        
        .populate("magazine")
        .populate("academy", "name")
        .populate("user")
        .sort({
          createdAt: 1,
        })
        .skip((page - 1) * limit)
        .limit(limit));
    default:
      return (allIdeaInDB = await IdeaModel.find({})
      
        .populate("magazine")
        .populate("academy", "name")
        .populate("user")
        .sort({ viewCount: -1 })
        .skip((page - 1) * limit)
        .limit(limit));
  }
};

const getIdeaById = async (id) => {
  return await IdeaModel.findById(id)
 
    .populate("magazine", "name")
    .populate("academy", "name")
    .populate("user", "username fullname department role avatar")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        model: "Users",
        select: "username fullname department",
      },
    })
    .populate({
      path: "reactions",
      populate: {
        path: "user",
        model: "Users",
        select: "username fullname department",
      },
    });
};

const editIdea = async (id, editIdeaItem) => {
  try {
    const { title, description, documentLink, isApprove } = editIdeaItem;
    console.log(editIdeaItem);
    let idea;
    if (isApprove) {
      idea = await IdeaModel.findOneAndUpdate(
        { _id: id },
        { $set: { isApprove } },
        { new: true }
      );
    } else {
      idea = await IdeaModel.findOneAndUpdate(
        { _id: id },
        { $set: { title, description, documentLink } },
        { new: true }
      );
    }

    if (!idea) {
      throw new Error("Idea not found");
    }

    return idea;
  } catch (error) {
    console.error("Error editing idea:", error);
    throw error;
  }
};
const increaseView = async (id) => {
  const increaseViewCount = await IdeaModel.findById(id);
  increaseViewCount.viewCount = increaseViewCount.viewCount + 1;
  await increaseViewCount.save();
};

const createIdea = async (
  title,
  description,
  documentLink = "",
  userId,
  academy,
  magazineId
) => {
  const findUserIndDeaprtment = await UserModel.findById(userId.toString());
  const academyInDb = await AcademicYear.findOne({ name: academy });
  const findMagazineInDb = await MagazineModel.findById(magazineId);

  const newIdea = new IdeaModel({
    title,
    description,
    documentLink, 
    user: findUserIndDeaprtment._id,
    department: findUserIndDeaprtment.department,
    academy: academyInDb._id,
    magazine: findMagazineInDb._id,
  });
  await newIdea.save();
  findMagazineInDb.ideas.push(newIdea._id);
  await findMagazineInDb.save();
  return newIdea;
};

const countAllIdeas = async (limit = 5) => {
  return Math.ceil((await IdeaModel.estimatedDocumentCount()) / limit);
};

const commentToAnIdea = async (
  postId,
  content,
  userId,
  origin
) => {
  const ideaInDb = await IdeaModel.findById(postId);
  const author = await UserModel.findById(ideaInDb.user);
  ideaInDb.comments.push({ content, user: userId });
  await ideaInDb.save();
};

const reactionToAnIdea = async (postId, reactionType, userId, origin) => {
  const ideaInDb = await IdeaModel.findById(postId);
  const author = await UserModel.findById(ideaInDb.user);
  const newReaction = { reactionType, user: userId };
  const indexFound = ideaInDb.reactions.findIndex(
    (reaction) => reaction.user.toString() === userId
  );
  if (indexFound >= 0) {
    ideaInDb.reactions.splice(indexFound, 1, newReaction);
  } else {
    ideaInDb.reactions.push(newReaction);
  }
  await ideaInDb.save();
};

const countIdeaInDepartment = async () => {
  const result = await IdeaModel.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 } } },
  ]);
  return result;
};

const findPostIdea = async () => {
  let nameDepartments = [];
  const listAllUserInDepartment = await DepartmentModel.find({
    deleted: false,
  }).select({ name: 1, _id: 0 });
  let convert = JSON.stringify(listAllUserInDepartment);
  convert = JSON.parse(convert);

  convert.map((item) => {
    nameDepartments.push(Object.values(item)[0]);
  });
  return nameDepartments;
};

const findUserIdInDerpartment = async (nameDepartments) => {
  const number = nameDepartments.map(async (item) => {
    const finduserInDepartment = await UserModel.find({
      department: item,
      deleted: false,
    }).select({ _id: 1 });
    let users = JSON.stringify(finduserInDepartment);
    users = JSON.parse(users);
    const findIdeaPosted = await IdeaModel.find({ department: item })
      .select({ user: 1, _id: 0 })
      .distinct("user");
    let userPosted = JSON.stringify(findIdeaPosted);
    userPosted = JSON.parse(userPosted);
    let result = {
      label: item,
      posted: userPosted.length,
      noPosted: users.length - userPosted.length,
    };
    return result;
  });

  return Promise.all(number);
};

const countIdeaInOneDepartment = async (department) => {
  const result = await IdeaModel.aggregate()
    .match({
      department: department,
    })
    .group({ _id: "$user", count: { $sum: 1 } })
    .lookup({
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user",
    });
  return result;
};

const findStaffPostOfDepatment = async (department) => {
  const finduserInDepartment = await UserModel.find({
    department: department,
    role: "Staff",
  }).select({ _id: 1 });
  let users = JSON.stringify(finduserInDepartment);
  users = JSON.parse(users);

  const findIdeaPosted = await IdeaModel.find({ department: department })
    .select({ user: 1, _id: 0 })
    .distinct("user");
  let userPosted = JSON.stringify(findIdeaPosted);
  userPosted = JSON.parse(userPosted);

  let result = [
    {
      StaffPosted: userPosted.length,
      StaffnoPosted: users.length - userPosted.length,
    },
  ];

  return result;
};

const getFileUrl = async (filename) => {
  try {
    const documentLink = `/statics/documents/${filename}`;
    const result = await uploadDocument(__basedir + documentLink, filename);
    fs.unlinkSync(__basedir + documentLink);
    return result.url;
  } catch (error) {
    console.log(error);
  }
};

const getIdeaStatistics = async () => {
  try {
    const academics = await AcademicYear.find({ deleted: false });
    let acaArray = await Promise.all(
      academics.map(async (aca) => {
        const departmentArray = await countIdeasByAcademyAndDepartment(aca._id);
        return {
          name: aca.name,
          departmentArray: departmentArray,
          total: departmentArray.reduce((total, department) => {
            return total + department.count;
          }, 0),
        };
      })
    );

    return acaArray;
  } catch (err) {
    console.log(err);
  }
};

const getUserStatistic = async () => {
  try {
    const academics = await AcademicYear.find({ deleted: false });
    let acaArray = await Promise.all(
      academics.map(async (aca) => {
        const departmentArray = await countUserByAcademyAndDepartment(aca._id);
        return {
          name: aca.name,
          departmentArray: departmentArray,
          total: departmentArray.reduce((total, department) => {
            return total + department.count;
          }, 0),
        };
      })
    );

    return acaArray;
  } catch (err) {
    console.log(err);
  }
};

const countUserByAcademyAndDepartment = async (academyId) => {
  const ideas = await IdeaModel.find({ academy: academyId, isApprove: true });
  const departments = await DepartmentModel.find({});
  let departmentArray = [];
  const uniqueUsers = Object.values(
    ideas.reduce((acc, obj) => {
      acc[obj.user] = obj;
      return acc;
    }, {})
  );

  departments.forEach((department) => {
    let temp = {
      name: department.name,
      count: 0,
    };
    uniqueUsers.forEach((idea) => {
      if (idea.department === department.name) {
        temp.count += 1;
      }
    });

    departmentArray.push(temp);
  });
  return departmentArray;
};

const countIdeasByAcademyAndDepartment = async (academyId) => {
  const ideas = await IdeaModel.find({ academy: academyId, isApprove: true });
  const departments = await DepartmentModel.find({});
  let departmentArray = [];
  departments.forEach((department) => {
    let temp = {
      name: department.name,
      count: 0,
    };
    ideas.forEach((idea) => {
      if (idea.department === department.name) {
        temp.count += 1;
      }
    });

    departmentArray.push(temp);
  });
  return departmentArray;
};

module.exports = {
  createIdea,
  getAllIdeaWithFilter,
  countAllIdeas,
  getIdeaById,
  commentToAnIdea,
  reactionToAnIdea,
  increaseView,
  countIdeaInDepartment,
  findPostIdea,
  findUserIdInDerpartment,
  countIdeaInOneDepartment,
  findStaffPostOfDepatment,
  getFileUrl,
  editIdea,
  getIdeaStatistics,
  getUserStatistic,
};
