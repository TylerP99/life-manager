const express = require("express");
const router = express.Router();

const HabitController = require("../../controllers/habits-controller");

router.post("/create", HabitController.create_habit_handler);

router.put("/update/:id", HabitController.update_habit_handler);

router.delete("/delete/:id", HabitController.delete_habit_handler);

module.exports = router;