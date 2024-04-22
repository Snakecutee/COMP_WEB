const academicRouter = require("express").Router();
const academicController = require("../controller/academic.controller");
const passport = require("passport");
const { authorize } = require("../middleware/authorization");

academicRouter.use(passport.authenticate("jwt", { session: false }));

academicRouter.post(
  "/",
  authorize(process.env.ADMIN),
  academicController.create
);
academicRouter.get("/", academicController.getAll);
academicRouter.put(
  "/:id",
  authorize(process.env.ADMIN),
  academicController.update
);
academicRouter.post(
  "/delete/:id",
  authorize(process.env.ADMIN),
  academicController.deleteAcademy
);
academicRouter.get(
  "/:id",
  authorize(process.env.ADMIN),
  academicController.getById
);


module.exports = academicRouter;
