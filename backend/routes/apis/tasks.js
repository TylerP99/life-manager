// Task API Router: Create, get, update, delete tasks
// Current route: /api/task/

const express = require("express");
const router = express.Router();

const TaskController = require("../../controllers/tasks-controller.js");

// Create new task
router.post("/create", TaskController.create_task_handler);

// Update task properties
router.put("/update/:id", TaskController.update_task_handler);

// Mark task as complete
router.put("/markComplete/:id", TaskController.mark_complete_handler);

// Mark task as incomplete
router.put("/markIncomplete/:id", TaskController.mark_incomplete_handler);

// Delete task
router.delete("/delete/:id", TaskController.delete_task_handler);

module.exports = router;