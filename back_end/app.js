const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const passport = require("passport");
const errorhandler = require("errorhandler");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");



const db = require("./persistance/db");
const app = express();

global.__basedir = __dirname;
app.use("/statics", express.static(path.join(__dirname, "statics")));

app.use(passport.initialize());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  expressSession({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
  })
);

// /app.use(helmet());
app.use(morgan("dev"));
app.use(errorhandler());
app.use(express.json({ urlEncoded: true }));
app.use(express.urlencoded({ extended: false }));
app.use(passport.session());
app.use(cookieParser());

db.connect(process.env.DB_URL);



module.exports = app;
