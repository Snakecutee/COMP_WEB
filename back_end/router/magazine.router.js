const magazineRouter = require("express").Router();
const magazineController = require("../controller/magazine.controller");
const { authorize } = require("../middleware/authorization");
const passport = require("passport");

magazineRouter.post(
    "/delete/:id",
    [
      passport.authenticate("jwt", { session: false }),
      authorize([
        process.env.MARKETINGMANAGER
      ]),
    ],
    magazineController.deleteMagazine
  );