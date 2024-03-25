const rootRouter = require("express").Router();

const authenticateRouter = require("./authenticate.router");
const userRouter = require("./user.router");
const uploadRouter = require("./upload.router");





rootRouter.use(`/upload`, uploadRouter);
rootRouter.use(`/auth`, authenticateRouter);
rootRouter.use(`/users`, userRouter);

module.exports = rootRouter;