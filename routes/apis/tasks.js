// Task API Router: Create, get, update, delete tasks
// Current route: /api/task/

const express = require("express");
const router = express.Router();

const TaskController = require("../../controllers/tasks-controller.js");

// Create new task
router.post("/create", TaskController.create_task);

// Update task properties
router.put("/update/:id", TaskController.update_task);

// Mark task as complete
router.put("/markComplete/:id", TaskController.mark_complete);

// Mark task as incomplete
router.put("/markIncomplete/:id", TaskController.mark_incomplete);

// Delete task
router.delete("/delete/:id", TaskController.delete_task);

module.exports = router;