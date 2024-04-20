const ideaRouter = require("express").Router({ mergeParams: true });
const { uploadDocument } = require("../middleware/mutler");
const upload = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../statics/documents");

fs.mkdirSync(uploadDir, { recursive: true });

const {
  createIdeaWithDocument,
  getAllIdeas,
  getSingleIdea,
  commentToIdea,
  reactionToIdea,
  inscreaseViewOfIdea,
  countIdea,
  findPost,
  countIdeaOfDepartment,
  findPostOfDepartment,
  uploadSupportDocument,
  updateIdea,
  getEndateIdeas,
} = require("../controller/idea.controller");
const passport = require("passport");
const { authorize } = require("../middleware/authorization");
ideaRouter.get("/end-date", getEndateIdeas);
ideaRouter.use([passport.authenticate("jwt", { session: false }), authorize()]);
ideaRouter.get("/", getAllIdeas);
ideaRouter.get("/count", countIdea);
ideaRouter.get("/find-ideas", findPost);
ideaRouter.get("/department/count", countIdeaOfDepartment);
ideaRouter.get("/department/find-post", findPostOfDepartment);
ideaRouter.get("/:id", getSingleIdea);
ideaRouter.post("/:id/comment", commentToIdea);
ideaRouter.get("/:id/view", inscreaseViewOfIdea);
ideaRouter.post("/:id/reaction", reactionToIdea);
ideaRouter.post("/create", createIdeaWithDocument);
ideaRouter.post(
  "/upload",
  uploadDocument.single("document"),
  uploadSupportDocument
);
ideaRouter.put("/update/:id", updateIdea);

module.exports = ideaRouter;
