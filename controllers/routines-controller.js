/*
    Reworked routines controller. The prior routines controller worked with individual tasks; however, a better approach would be to use the habit functionality to make the routine management process easier and more efficient. This is because a routine is a set of repeating tasks, but habits are also repeating tasks. So, using habits would work better and reduce code repetition. Can also minimize where the use of scheduling jobs is found.
*/

const Routine = require("../models/Routine.js");
const Habit = require("../models/Habit.js");
const Task = require("../models/Task.js");

const mongoose = require("mongoose");

const HabitController = require("../controllers/habits-controller.js");

const RoutineController = {

    /*
        Route handler for routine creation. Gets and formats routine information. Creates habit objects and sends to habit creation controller. Adds habit ids to routine document. Responds to request
    */
    create_routine_handler: async (req, res, next) => {
        const routine = RoutineController.format_routine_request_form(req.body, req.user);

        try {
            // Send routine info to creation function, which will validate the routine, create the routine habits, and store all info in db
            const errors = await RoutineController.create_routine(routine);
            console.log(errors);
            // If there are errors, store in flash
            if(errors) {
                req.flash("errors", errors);
            }
            // Otherwise store success
            else {
                req.flash("success", "Routine successfully created!");
            }

            // Respond
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    update_routine_handler: async (req, res, next) => {
        const routine = {
            name: req.body.name,
            howOften: {
                step: req.body.step,
                timeUnit: req.body.timeUnit,
            },
        };
        const userDate = new Date(req.body.userDate);
        routine.startDate = new Date(userDate);
        req.body.startDate = req.body.startDate.split("-");
        routine.startDate.setFullYear(req.body.startDate[0]);
        routine.startDate.setMonth(req.body.startDate[1]-1);
        routine.startDate.setDate(req.body.startDate[2]);
        routine.startDate.setHours(0);
        routine.startDate.setMinutes(0);
        routine.startDate.setSeconds(0);

        if(req.body.description.length) {
            routine.description = req.body.description;
        }

        try {
            const errors = await RoutineController.update_routine(routine, req.params.id);

            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Routine successfully updated!");
            }

            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    delete_routine_handler: async (req, res, next) => {
        try {
            await RoutineController.delete_routine(req.params.id);

            req.flash("success", "Routine successfully deleted!");
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    add_routine_task_handler: async (req, res, next) => {
        const habit = HabitController.format_habit_request_form(req.body, req.user);

        try {
            // Send habit over to add function
            const errors = await RoutineController.add_routine_task(habit, req.params.id);
            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Successfully added to routine!");
            }
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    update_routine_task_handler: async (req, res, next) => {
        const habit = HabitController.format_habit_request_form(req.body, req.user);

        try {
            const errors = await RoutineController.update_routine_task(habit, req.params.id);
            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Task successfully updated");
            }

            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    delete_routine_task_handler: async (req, res, next) => {
        try {
            console.log(req.params.habitID);
            console.log(req.params.id);
            await RoutineController.delete_routine_task(req.params.habitID, req.params.id);
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    create_routine: async (routine) => {
        // Validate routine info
        const errors = RoutineController.validate_routine(routine);

        console.log(routine);

        // If errors in validation, return
        if(errors.length) {
            return errors;
        }

        // Create routine document in db (dont send habits)
        const habits = routine.habits;
        routine.habits = undefined;
        const dbRoutine = await Routine.create(routine);

        // For each habit in the routine, add it to the routine (this will handle habit creation and task creation and scheduling)
        for(let i = 0; i < habits.length; ++i) {
            const habitInfo = await RoutineController.add_routine_task(habits[i], dbRoutine._id);

            // Habit info is either an error array or undefined
            if(Array.isArray(habitInfo)) {
                return habitInfo;
            }
        }

        return dbRoutine;
    },

    /*
        Handles updating routine properties (name, description, startDate, and howOften)
        Params:
            routine - A JS object representing a routine object
            routineID - Mongo ID of routine to update
        Returns:
            An error array if there are errors, or undefined if routine is updated successfully
    */
    update_routine: async (routine, routineID) => {
        // Get old routine from db
        const oldRoutine = await Routine.findById(routineID);

        // If startDate or howOften is changed, need to update all associated habits.
        if(routine.startDate != oldRoutine.startDate || routine.howOften.step != oldRoutine.howOften.step || routine.howOften.timeUnit != routine.howOften.timeUnit) {
            for(let i = 0; i < oldRoutine.habits.length; ++i) {
                const habit = await Habit.findById(oldRoutine.habits[i]);

                // Construct a proper habit object to send to habit controller, using habit info from db and updates to occurence and start
                const newHabit = {
                    name: habit.name,
                    description: habit.description,
                    startDate: new Date(routine.startDate),
                    howOften: routine.howOften,
                    startTime: habit.startTime,
                    endTime: habit.endTime,
                    owner: habit.owner,
                };
                newHabit.endDate = new Date(newHabit.startDate);
                newHabit.endDate.setFullYear(newHabit.endDate.getFullYear() + 100);

                const errors = await RoutineController.update_routine_task(newHabit, oldRoutine.habits[i]);
                if(errors) {
                    return errors;
                }
            }
        }

        // Otherwise, just update routine params
        await Routine.findByIdAndUpdate(routineID, routine);

        // Success
        return undefined;
    },

    delete_routine: async (routineID) => {
        // Get routine from db
        const routine = await Routine.findById(routineID);

        // If the routine isnt found, leave
        if(!routine) {
            return;
        }

        // Delete all children
        if(routine.habits) {
            for(let i = 0; i < routine.habits.length; ++i) {
                await HabitController.delete_habit(routine.habits[i]); // Use habit controller delete over routine task delete, since we dont need to remove id from child array (less db calls, the better). Should delete habit and all associated tasks
            }
        }

        // Delete routine itself
        await Routine.findByIdAndDelete(routineID);
    },

    add_routine_task: async (habit, routineID) => {
        // Create habit with habit controller (handles validation, formatting, and db creation)
        const info = await HabitController.create_habit(habit);

        console.log("Habit controller return");
        console.log(info._id);

        // If we get an array back, its an error array. Return error array
        if(Array.isArray(info)) {
            return info;
        }

        // Otherwise, we get the habit itself back. Need to store id in routine.
        await Routine.findByIdAndUpdate(routineID,
            {
                $push: {
                    habits: info._id
                }
            }
        )
        console.log("Pushed");
        return undefined;
    },

    update_routine_task: async (habit, habitID) => {
        // Send habit to update habit controller
        const errors = await HabitController.update_habit(habit, habitID);

        if(errors) {
            return errors;
        }

        return undefined;
    },

    delete_routine_task: async (habitID, routineID) => {
        // Send habit to delete habit controller
        await HabitController.delete_habit(habitID);

        // Delete id from routine
        await Routine.findByIdAndUpdate(routineID,
            {
                $pull: {
                    habits: new mongoose.mongo.ObjectId(habitID)
                }
            }
        )
    },

    validate_routine: (routine) => {
        const errors = [];

        return errors;
    },

    format_routine_request_form: (requestBody, requestUser) => {
        // This request body will contain routine information and habit information
        const routine = {
            name: requestBody.name,
            howOften: {
                timeUnit: requestBody.timeUnit,
                step: requestBody.step
            },
            habits: [],
            owner: requestUser.id,
        }

        const userDate = new Date(requestBody.userDate);

        // Fill description if entered
        if(requestBody.description.length) {
            routine.description = requestBody.description;
        }

        // Fill startDate if entered, or use default date
        routine.startDate = new Date(userDate);
        routine.startDate.setHours(0);
        routine.startDate.setMinutes(0);
        routine.startDate.setSeconds(0);
        if(requestBody.startDate.length) {
            requestBody.startDate = requestBody.startDate.split("-");
            routine.startDate.setFullYear(requestBody.startDate[0]);
            routine.startDate.setMonth(requestBody.startDate[1]-1);
            routine.startDate.setDate(requestBody.startDate[2]);
        }

        if(!Array.isArray(requestBody.habitName)) {
            requestBody.habitName = [requestBody.habitName];
            requestBody.habitDescription = [requestBody.habitDescription];
            requestBody.startTime = [requestBody.startTime];
            requestBody.endTime = [requestBody.endTime];
        }

        // Now, make the habits
        for(let i = 0; i < requestBody.habitName.length; ++i) {
            // Form a habit request body
            const habit = {
                name: requestBody.habitName[i],
                startDate: new Date(routine.startDate),
                endDate: new Date(routine.startDate),
                howOften: {
                    step: requestBody.step,
                    timeUnit: requestBody.timeUnit
                },
                owner: requestUser.id,
            }
            // Description
            if(requestBody.habitDescription[i]?.length) {
                habit.description = requestBody.habitDescription[i];
            }
            
            // EndDate
            habit.endDate.setFullYear(habit.endDate.getFullYear() + 100);
            // StartTime
            if(requestBody.startTime[i].length) {
                requestBody.startTime[i] = requestBody.startTime[i].split(":");
                habit.startTime = new Date(habit.startDate);
                habit.startTime.setHours(requestBody.startTime[i][0]);
                habit.startTime.setMinutes(requestBody.startTime[i][1]);
            }
            // EndTime
            if(requestBody.endTime[i].length) {
                requestBody.endTime[i] = requestBody.endTime[i].split(":");
                habit.endTime = new Date(habit.startDate);
                habit.endTime.setHours(requestBody.endTime[i][0]);
                habit.endTime.setMinutes(requestBody.endTime[i][1]);
            }

            routine.habits.push(habit);
        }

        return routine;
    },
};

module.exports = RoutineController;