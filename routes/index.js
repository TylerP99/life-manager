const express = require("express");
const router = express.Router();

const IndexController = require("../controllers/index-controller.js");
const { ensureAuthenticated } = require("../middleware/auth.js");

// Landing page
router.get("/", IndexController.get_landing_page);

// Dashboard
router.get("/dashboard", ensureAuthenticated, IndexController.get_dashboard);

// Users
router.use("/users", require("./users.js"));

// Apis
router.use("/api", require("./api.js"));

module.exports = router;