const express = require("express");
const router = express.Router();

const GoalController = require("../../controllers/goals-controller");

router.post("/create", GoalController.create_new_goal);

router.put("/update/:id", GoalController.update_goal);

router.delete("/delete/:id", GoalController.delete_goal);

module.exports = router;