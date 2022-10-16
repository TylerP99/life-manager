const express = require("express");
const router = express.Router();

const GoalController = require("../../controllers/goals-controller");

router.post("/create", GoalController.create_new_goal_handler);

router.put("/addTask/:id", GoalController.add_new_task_handler);

router.put("/addHabit/:id", GoalController.add_new_habit_handler);

router.put("/addRoutine/:id", GoalController.add_new_routine_handler);

// TODO
router.put("/addGoal/:id", GoalController.add_new_goal_handler);

router.put("/update/:id", GoalController.update_goal_handler);

router.delete("/delete/:id", GoalController.delete_goal_handler);

router.delete("/deleteTask/:id", GoalController.delete_task_handler);

router.delete("/deleteHabit/:id", GoalController.delete_habit_handler);

router.delete("/deleteRoutine/:id", GoalController.delete_routine_handler);

module.exports = router;