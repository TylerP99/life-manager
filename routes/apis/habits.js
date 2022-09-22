const express = require("express");
const router = express.Router();

const HabitController = require("../../controllers/habits-controller");

router.post("/create", HabitController.create_new_habit);

router.put("/update", HabitController.update_habit);

router.delete("/delete", HabitController.delete_habit);

module.exports = router;