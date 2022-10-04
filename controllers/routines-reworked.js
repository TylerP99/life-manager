/*
    Reworked routines controller. The prior routines controller worked with individual tasks; however, a better approach would be to use the habit functionality to make the routine management process easier and more efficient. This is because a routine is a set of repeating tasks, but habits are also repeating tasks. So, using habits would work better and reduce code repetition. Can also minimize where the use of scheduling jobs is found.
*/

const Routine = require("../models/Routine.js");
const Habit = require("../models/Habit.js");
const Task = require("../models/Task.js");

const HabitController = require("../controllers/routines-controller.js");

module.exports = {

    create_routine_handler: async (req, res, next) => {

    },

    update_routine_handler: async (req, res, next) => {

    },

    delete_routine_handler: async (req, res, next) => {

    },

    add_routine_task_handler: async (req, res, next) => {

    },

    update_routine_task_handler: async (req, res, next) => {

    },

    delete_routine_task_handler: async (req, res, next) => {

    },

    create_routine: async (routine) => {

    },

    update_routine: async (routine, routineID) => {

    },

    delete_routine: async (routineID) => {

    },

    add_routine_task: async (habit, routineID) => {

    },

    update_routine_task: async (habit, habitID, routineID) => {

    },

    delete_routine_task: async (habitID, routineID) => {

    },

};