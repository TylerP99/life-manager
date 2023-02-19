const express = require("express");

// Env file constants
require("dotenv").config();

// Middleware and config
const app = express();
app.set("view engine","ejs");

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./public"));

// DB Connect
const connectDB = require("./config/database.js");
connectDB();

// Logger
const morgan = require("morgan");
app.use(morgan("dev"));

// User Auth and Sessions
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const MongoStore = require("connect-mongo");

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.DB_STRING })
    })
);

const init_passport_local = require("./config/passport-config.js");
init_passport_local(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Method Override for form PUTs and DELETEs
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Init jobs
const JobController = require("./controllers/job-controller");
JobController.init_task_creation_jobs();
JobController.init_task_reminder_jobs();

// Routes
app.use("/", require("./routes/index.js"));

// Start app
app.listen(process.env.PORT, _ => {
    console.log(`Server running on port ${process.env.PORT}`)
});
