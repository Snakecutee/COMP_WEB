const rootRouter = require("express").Router();

const authenticateRouter = require("./authenticate.router");
const userRouter = require("./user.router");
const uploadRouter = require("./upload.router");
const departmentRouter = require("./department.router");
const academicRouter = require("./academic.router");
const ideaRouter = require("./ideas.router");
const magazineRouter = require("./magazine.router");

rootRouter.use(`/upload`, uploadRouter);
rootRouter.use(`/auth`, authenticateRouter);
rootRouter.use(`/users`, userRouter);
rootRouter.use(`/departments`, departmentRouter);
rootRouter.use(`/academic`, academicRouter);
rootRouter.use("/ideas", ideaRouter);
rootRouter.use("/magazine", magazineRouter);

module.exports = rootRouter;
