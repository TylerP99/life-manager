const express = require("express");
const router = express.Router();

const IndexController = require("../controllers/index-controller.js");
const { ensureAuthenticated } = require("../middleware/auth.js");

// Landing page
router.get("/", IndexController.get_landing_page);

// Dashboard
router.get("/dashboard", ensureAuthenticated, IndexController.get_dashboard);

// Tasks
router.get("/tasks", ensureAuthenticated, IndexController.get_tasks_page);

// Habits Page
router.get("/habits", ensureAuthenticated, IndexController.get_habits_page);

// Routines Page
router.get("/routines", ensureAuthenticated, IndexController.get_routines_page);

// Goals Page
router.get("/goals", ensureAuthenticated, IndexController.get_goals_page);

router.get("/createGoal", ensureAuthenticated, IndexController.get_goal_creation_page);

// Users
router.use("/users", require("./users.js"));

// Apis
router.use("/api", require("./api.js"));

module.exports = router;