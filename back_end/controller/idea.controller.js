const {
  createIdea,
  getAllIdeaWithFilter,
  countAllIdeas,
  getIdeaById,
  commentToAnIdea,
  reactionToAnIdea,
  increaseView,
  countIdeaInDepartment,
  countIdeaInOneDepartment,
  findPostIdea,
  findUserIdInDerpartment,
  findStaffPostOfDepatment,
  getFileUrl,
  editIdea,
  getIdeaStatistics,
  getUserStatistic,
} = require("../service/idea.service");

const getAllIdeas = async (req, res) => {
  const { filter, page } = req.query;
  const id = req.user??._id;
  const pages = await countAllIdeas();
  const allIdeas = await getAllIdeaWithFilter(id, filter, page);
  res.status(200).json({ pages, data: allIdeas });
};

const getEndateIdeas = async (req, res) => {
  const { filter, page } = req.query;
  const pages = await countAllIdeas();
  const allIdeas = await getAllIdeaWithFilter(null, filter, page);
  res.status(200).json({ pages, data: allIdeas });
};

const updateIdea = async (req, res) => {
  const { id } = req.params;
  const editData = await editIdea(id, req.body);
  res.status(201).json({ message: "Edit success", data: editData });
};

const getSingleIdea = async (req, res) => {
  const { id } = req.params;
  const data = await getIdeaById(id);
  res.status(200).json({ data });
};

const commentToIdea = async (req, res) => {
  const { userId, content } = req.body;
  const { id } = req.params;
  const origin = req.get("origin");

  await commentToAnIdea(id, content, userId,  origin);
  res.status(201).json({ message: "comment success" });
};
const reactionToIdea = async (req, res) => {
  const { userId, reactionType } = req.body;
  const { id } = req.params;
  const origin = req.get("origin");

  await reactionToAnIdea(id, reactionType, userId, origin);
  res.status(201).json({ message: "react success" });
};

const createIdeaWithDocument = async (req, res) => {
  const {
    title,
    description,
    documentLink,
    academy,
    magazineId,
  } = req.body;
  const userId = req?.user?._id || null;
  const createdIdea = await createIdea(
    title,
    description,
    documentLink,
    userId,
    academy,
    magazineId
  );
  res.status(201).json({ message: "Idea Created", data: createdIdea });
};

const inscreaseViewOfIdea = async (req, res) => {
  await increaseView(req.params.id);
  res.sendStatus(200);
};

const countIdea = async (req, res) => {
  const result = await countIdeaInDepartment();
  res.status(200).json(result);
};

const findPost = async (req, res) => {
  const nameDepartment = await findPostIdea();
  const result = await findUserIdInDerpartment(nameDepartment);
  res.status(200).send(result);
};

const countIdeaOfDepartment = async (req, res) => {
  const result = await countIdeaInOneDepartment(req.user.department);
  res.status(200).json(result);
};

const findPostOfDepartment = async (req, res) => {
  const result = await findStaffPostOfDepatment(req.user.department);
  res.status(200).json(result);
};
const uploadSupportDocument = async (req, res) => {
  console.log("da la req.file uploadsupport", req.file);
  const filename = req.file.filename;
  const documentLink = await getFileUrl(filename);

  res.status(201).json({ documentLink });
};

const statisticsIdeas = async (req, res) => {
  const data = await getIdeaStatistics();
  res.status(201).json(data);
};

const statisticsUsers = async (req, res) => {
  const data = await getUserStatistic();
  res.status(201).json(data);
};
module.exports = {
  createIdeaWithDocument,
  getAllIdeas,
  getSingleIdea,
  updateIdea,
  commentToIdea,
  reactionToIdea,
  inscreaseViewOfIdea,
  countIdea,
  findPost,
  countIdeaOfDepartment,
  findPostOfDepartment,
  uploadSupportDocument,
  getEndateIdeas,
  statisticsIdeas,
  statisticsUsers,
};
