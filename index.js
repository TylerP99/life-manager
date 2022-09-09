const express = require("express");

// Env file constants
require("dotenv").config();

// Middleware and config
const app = express();
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

// Logger
const morgan = require("morgan");
app.use(morgan("dev"));

// DB Connect
const connectDB = require("./config/database.js");
connectDB();

// User Auth and Sessions
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true
    })
);

const init_passport_local = require("./config/passport-config.js");
init_passport_local(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


// Routes

// Start app
app.listen(PORT, _ => {
    console.log(`Server running on port ${PORT}`)
});