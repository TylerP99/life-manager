
const Goal = require("../models/Goal");
const Routine = require("../models/Routine");
const Habit = require("../models/Habit");
const Task = require("../models/Task");

const RoutineController = require("../controllers/routines-controller");
const HabitController = require("../controllers/habits-controller");
const TaskController = require("../controllers/tasks-controller");

const mongoose = require("mongoose");

const GoalController =  {

    create_new_goal_handler: async (req, res, next) => {
        // Change request body into goal object
        const goal = GoalController.format_goal_request_form(req.body, req.user);

        try {
            // Validate and store goal in db
            const info = await GoalController.create_goal(goal);

            if(Array.isArray(info)) {
                req.flash("errors", info);
            }
            else {
                req.flash("success", "Goal successfully created!");
            }

            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    add_new_task_handler: async (req, res, next) => {
        // Get task from body
        const task = TaskController.format_task_request_form(req.body, req.user);

        try {
            // Create task and store in goal
            const errors = await GoalController.add_task(task, req.params.id);

            // If create tasks sends back an error array, store in flash
            if(errors) {
                req.flash("errors",errors);
            }
            else {
                req.flash("success", "Task successfully added to goal.");
            }

            // Respond
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    add_new_habit_handler: async (req, res, next) => {
        const habit = HabitController.format_habit_request_form(req.body, req.user);

        try {
            const errors = await GoalController.add_habit(habit, req.params.id);

            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Habit successfully added to goal.");
            }
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    add_new_routine_handler: async (req, res, next) => {
        const routine = RoutineController.format_routine_request_form(req.body, req.user);

        try {
            const errors = await GoalController.add_routine(routine, req.params.id);

            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Routine successfully added to goal.");
            }
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    add_new_goal_handler: async (req, res, next) => {
        const goal = GoalController.format_goal_request_form(req.body, req.user);

        try {
            const errors = await GoalController.add_goal(goal, req.params.id);

            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Sub-goal successfully added.");
            }
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    update_goal_handler: async (req, res, next) => {
        const goal = GoalController.format_goal_request_form(req.body, req.user);

        try {
            const errors = await GoalController.update_goal(goal, req.params.id);

            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Goal successfully updated.");
            }
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    delete_goal_handler: async (req, res, next) => {
        try {
            await GoalController.delete_goal(req.params.id);
            req.flash("success", "Goal successfully deleted.");
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    delete_task_handler: async (req, res, next) => {
        try {
            await GoalController.delete_task(req.params.taskID, req.params.id);
            req.flash("success", "Task succesfully deleted.");
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    delete_habit_handler: async (req, res, next) => {
        try {
            await GoalController.delete_habit(req.params.habitID, req.params.id);
            req.flash("success", "Habit successfully deleted.");
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    delete_routine_handler: async (req, res, next) => {
        try {
            await GoalController.delete_routine(req.params.routineID, req.params.id);
            req.flash("success", "Routine successfully deleted.");
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    create_goal: async (goal) => {
        // Validate goal to make sure it follows constraints
        const errors = GoalController.validate_goal(goal);

        // If there are errors, return them here
        if(errors.length) {
            return errors;
        }

        // Create goal and get it back from db, need id if making child goal
        const newGoal = await Goal.create(goal);
        return newGoal;
    },

    add_task: async (task, goalID) => {
        const info = await TaskController.create_task(task);

        // Got errors back from creation attempt
        if(Array.isArray(info)) {
            return info;
        }

        // Add task id to goal
        await Goal.findByIdAndUpdate(goalID,
            {
                $push: {
                    tasks: info._id,
                }
            }
        );

        return undefined;
    },
    add_habit: async (habit, goalID) => {
        const info = await HabitController.create_habit(habit);

        if(Array.isArray(info)) {
            return info;
        }

        await Goal.findByIdAndUpdate(goalID, {$push: {habits: info._id}});
        return undefined;
    },
    add_routine: async (routine, goalID) => {
        const info = await RoutineController.create_routine(routine);

        if(Array.isArray(info)) {
            return info;
        }

        await Goal.findByIdAndUpdate(goalID, {$push: {routines: info._id}});
        return undefined;
    },
    add_goal: async (goal, goalID) => {
        const info = await GoalController.create_goal(goal);

        if(Array.isArray(info)) {
            return info;
        }

        await Goal.findByIdAndUpdate(goalID, {$push: {goals: info._id}});
        return undefined;
    },
    update_goal: async (updatedGoal, goalID) => {
        const errors = GoalController.validate_goal(updatedGoal);

        if(errors.length) {
            return errors;
        }

        await Goal.findByIdAndUpdate(goalID, updatedGoal);
        return undefined;
    },
    delete_task: async (taskID, goalID) => {
        await Goal.findByIdAndUpdate(goalID, {$pull: {tasks: new mongoose.mongo.ObjectId(taskID)}});
        await TaskController.delete_task(taskID);
        return undefined;
    },
    delete_habit: async (habitID, goalID) => {
        await Goal.findByIdAndUpdate(goalID, {$pull: {habits: new mongoose.mongo.ObjectId(habitID)}});
        await HabitController.delete_habit(habitID);
        return undefined;
    },
    delete_routine: async (routineID, goalID) => {
        await Goal.findByIdAndUpdate(goalID, {$pull: {routines: new mongoose.mongo.ObjectId(routineID)}});
        await RoutineController.delete_routine(routineID);
    },
    delete_goal: async (goalID) => {
        const goal = await Goal.findById(goalID);

        // Delete all tasks
        await Task.deleteMany({tasks: {$in: goal.tasks}});

        // Delete all habits
        for(let i = 0; i < goal.habits.length; ++i) {
            await HabitController.delete_habit(goal.habits[i]);
        }
        // Delete all routines
        for(let i = 0; i < goal.routines.length; ++i) {
            await RoutineController.delete_routine(goal.routines[i]);
        }
        // Delete all goals
        for(let i = 0; i < goal.goals.length; ++i) {
            await GoalController.delete_goal(goal.goals[i]);
        }

        // If this is a subgoal, delete from parent
        if(goal.parent) {
            await Goal.findByIdAndUpdate(goal.parent, {$pull: {goal: new mongoose.mongo.ObjectId(goalID)}});
        }

        // Delete goal
        await Goal.findByIdAndDelete(goalID);

        return undefined;
    },
    validate_goal: (goal) => {
        const errors = [];

        if(goal.name.length > 50) {
            errors.push({msg: "Name cannot exceed 50 characters in length."});
        }

        if(goal.description?.length > 250) {
            errors.push({msg: "Description cannot exceed 250 characters in length."});
        }

        if(goal.endDate < goal.startDate) {
            errors.push({msg: "Ending date must come after starting date."});
        }

        return errors;
    },
    format_goal_request_form: (requestBody, requestUser) => {
        const userDate = new Date(requestBody.userDate);
        const goal = {
            name: requestBody.name,
            owner: requestUser.id,
        };

        if(requestBody.description.length) {
            goal.description = requestBody.description;
        }

        if(requestBody.location.length) {
            goal.location = requestBody.location;
        }

        if(requestBody.participants.length) {
            if(!Array.isArray(requestBody.participants)) requestBody.participants = [requestBody.participants];
            goal.participants = requestBody.participants;
        }

        goal.startDate = new Date(userDate);
        requestBody.startDate = requestBody.startDate.split("-");
        goal.startDate.setFullYear(requestBody.startDate[0]);
        goal.startDate.setMonth(requestBody.startDate[1]-1);
        goal.startDate.setDate(requestBody.startDate[2]);

        goal.endDate = new Date(userDate);
        requestBody.endDate = requestBody.endDate.split("-");
        goal.endDate.setFullYear(requestBody.endDate[0]);
        goal.endDate.setMonth(requestBody.endDate[1]-1);
        goal.endDate.setDate(requestBody.endDate[2]);

        return goal;
    }

};

module.exports = GoalController;