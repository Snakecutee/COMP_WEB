const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy, 
ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../model/user');


passport.use(new LocalStrategy(
  async function(username, password, next) {
    try {
      const user = await User.findOne({ username: username });
      if (!user) return next(null, false);
      user.validatePassword(password, next); //req.user;
    } catch (err) {
      return next(err);
    }
  }
));

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, next) => {
      try {
        let user = await User.findOne({ username: payload.subject });
        if (user) {
          return next(null, user);
        }
        return next(null, false);
      } catch (error) {
        console.log(error);
        return next(error, false);
      }
    }
  )
);

