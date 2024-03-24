const rootRouter = require("express").Router();

const authenticateRouter = require("./authenticate.router");
const userRouter = require("./user.router");







rootRouter.use(`/auth`, authenticateRouter);
rootRouter.use(`/users`, userRouter);

module.exports = rootRouter;