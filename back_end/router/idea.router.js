// ideaRouter.js
const { getAllIdeas } = require("../controller/idel.controller");
const ideaRouter = express.Router();
const { authorizeAdmin } = require("../middleware/authorization");
const {
    getAllIdeas,
  } = require("../controller/idea.controller");

ideaRouter.use([passport.authenticate("jwt", { session: false }), authorizeAdmin()]);

ideaRouter.get("/", getAllIdeas); // Route to get all ideas

module.exports = ideaRouter;
