const magazineRouter = require("express").Router();
const magazineController = require("../controller/magazine.controller");
const { authorize } = require("../middleware/authorization");
const passport = require("passport");

magazineRouter.get(
  "/getByDepartment",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([
      process.env.MARKETINGMANAGER,
      process.env.ADMIN,
      process.env.STUDENT,
      process.env.MARKETINGCOORDINATOR,
    ]),
  ],
  magazineController.getMagazineByDepartment
);

magazineRouter.get(
  "/getAll",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([
      process.env.MARKETINGMANAGER,
      process.env.ADMIN,
      process.env.MARKETINGCOORDINATOR,
    ]),
  ],
  magazineController.getAllMagazine
);

magazineRouter.get(
  "/getById/:id",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([
      process.env.MARKETINGMANAGER,
      process.env.ADMIN,
      process.env.STUDENT,
      process.env.MARKETINGCOORDINATOR,
    ]),
  ],
  magazineController.getMagazineById
);

magazineRouter.post(
  "/create",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([
      process.env.MARKETINGMANAGER,
      process.env.ADMIN,
      process.env.MARKETINGCOORDINATOR,
    ]),
  ],
  magazineController.createMagazine
);

magazineRouter.post(
  "/update",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([
      process.env.MARKETINGMANAGER,
      process.env.ADMIN,
      process.env.MARKETINGCOORDINATOR,
    ]),
  ],
  magazineController.updateMagazine
);

magazineRouter.post(
  "/delete/:id",
  [
    passport.authenticate("jwt", { session: false }),
    authorize([
      process.env.MARKETINGMANAGER,
      process.env.ADMIN,
      process.env.MARKETINGCOORDINATOR,
    ]),
  ],
  magazineController.deleteMagazine
);

module.exports = magazineRouter;
