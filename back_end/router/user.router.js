const userRouter = require("express").Router();
const userController = require("../controller/user.controller");
const passport = require("passport");
const { uploadExcel } = require("../middleware/mutler");
const { authorize } = require("../middleware/authorization");


userRouter.put(
  "/update/:id",
  [passport.authenticate("jwt", { session: false }), authorize()],
  userController.update
);

userRouter.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([process.env.ADMIN]),
  ],
  userController.delete
);


userRouter.get(
  "/",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([process.env.MARKETINGMANAGER, process.env.ADMIN]),
  ],
  userController.getAllUser
);

userRouter.get(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([
      process.env.MARKETINGMANAGER,
      process.env.ADMIN,
      process.env.STUDENT,
      process.env.MARKETINGCOORDINATOR,
    ]),
  ],
  userController.getUserById
);

module.exports = userRouter;
