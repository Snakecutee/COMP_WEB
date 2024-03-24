const authenticateRouter = require('express').Router();
const {
  login,
  register,
  refeshToken,
  logout,
  changePassword
} = require("../controller/authenticate.controller");
const passport = require('passport');

authenticateRouter.put('/update-password', passport.authenticate('jwt', {session: false}), changePassword)

authenticateRouter.post('/login', 
passport.authenticate('local', {session: false}),
login);

authenticateRouter.get("/refresh-token", refeshToken);

authenticateRouter.post('/register', register);

authenticateRouter.post("/logout", logout);

module.exports = authenticateRouter;