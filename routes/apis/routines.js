// Routines Routes
// A routine is a recurring set of tasks

const express = require("express");
const router = express.Router();

const RoutineController = require("../../controllers/routines-controller.js");

router.post("/create", RoutineController.create_new_habit);

router.put("/update/:id", RoutineController.update_routine);

router.delete("/delete/:id", RoutineController.delete_habit);

module.exports = router;