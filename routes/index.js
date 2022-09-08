const express = require("express");
const router = express.Router();

// Landing page
router.get("/", get_landing_page);

// Users
router.use("/users", require("users.js"));

// Apis
router.use("/api", require("api.js"));