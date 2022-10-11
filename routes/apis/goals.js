const express = require("express");
const router = express.Router();

const GoalController = require("../../controllers/goals-controller");

router.post("/create", GoalController.create_new_goal_handler);

router.put("/update/:id", GoalController.update_goal_handler);

router.delete("/delete/:id", GoalController.delete_goal_handler);

module.exports = router;