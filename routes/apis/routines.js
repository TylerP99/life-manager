// Routines Routes
// A routine is a recurring set of tasks

const express = require("express");
const router = express.Router();

const RoutineController = require("../../controllers/routines-controller.js");

router.post("/create", RoutineController.create_routine_handler);

router.put("/update/:id", RoutineController.update_routine_handler);

router.delete("/delete/:id", RoutineController.delete_routine_handler);

router.put("/addTask/:id", RoutineController.add_routine_task_handler);

router.put("/updateTask/:id/:habitID", RoutineController.update_routine_task_handler);

router.put("/deleteTask/:id/:habitID", RoutineController.delete_routine_task_handler);

module.exports = router;