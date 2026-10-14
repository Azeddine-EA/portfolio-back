var express = require("express");
const cors = require("cors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var projectsRouter = require("./routes/projects");
var usersRouter = require("./routes/user");
var contactRouter = require("./routes/contact");
var technologyRouter = require("./routes/technologies");

var app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "https://portfolio-front-six-sage.vercel.app",
      "https://portfolio-front-azeddine-dev.vercel.app",
      "https://portfolio-front-5x5pe7sln-azeddine-dev.vercel.app",
    ],
  }),
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/project", projectsRouter);
app.use("/contact", contactRouter);
app.use("/technology", technologyRouter);
console.log("APP.JS CHARGÉ");

module.exports = app;
