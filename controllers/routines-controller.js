/*
    Reworked routines controller. The prior routines controller worked with individual tasks; however, a better approach would be to use the habit functionality to make the routine management process easier and more efficient. This is because a routine is a set of repeating tasks, but habits are also repeating tasks. So, using habits would work better and reduce code repetition. Can also minimize where the use of scheduling jobs is found.
*/

const Routine = require("../models/Routine.js");
const Habit = require("../models/Habit.js");
const Task = require("../models/Task.js");

const HabitController = require("../controllers/routines-controller.js");

const RoutineController = {

    /*
        Route handler for routine creation. Gets and formats routine information. Creates habit objects and sends to habit creation controller. Adds habit ids to routine document. Responds to request
    */
    create_routine_handler: async (req, res, next) => {
        const userDate = new Date(req.body.userDate); // With client side js, grab user's current date/time, change to iso string, send in req.
        // Get routine data from req
        const routine = {
            name: req.body.name,
            description: (req.body.description.length) ? req.body.description : undefined,
            startDate: (req.body.startDate.length) ? req.body.startDate : new Date(userDate),
            howOften: {
                step: req.body.step,
                timeUnit: req.body.timeUnit,
            },
            habits: [],
            owner: req.user.id,
        };

        if(typeof routine.startDate == "string") {
            routine.startDate = routine.startDate.split("-");
            routine.startDate = new Date(routine.startDate[0], routine.startDate[1]-1, routine.startDate[2]);
        }

        for(let i = 0; i < req.body.taskName.length; ++i) {
            const habit = {
                name: req.body.taskName[i],
                description: (req.body.taskDescription[i].length) ? req.body.taskDescription[i] : undefined,
                startDate: routine.startDate,
                howOften: routine.howOften,
            }

            if(req.body.startTime[i].length) {
                habit.startTime = req.body.startTime[i];
            }
            if(req.body.endTime[i].length) {
                habit.endTime = req.body.endTime[i];
            }

            routine.habits.push(habit);
        }

        try {
            // Send routine info to creation function, which will validate the routine, create the routine habits, and store all info in db
            const errors = await RoutineController.create_routine(routine);

            // If there are errors, store in flash
            if(errors.length) {
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
        // Format routine object from request body
        const routine = {
            name: req.body.name,
            description: (req.body.description.length) ? req.body.description : undefined,
            howOften: {
                step: req.body.step,
                timeUnit: req.body.timeUnit,
            },
        };
        // Set start date to entered date
        req.body.startDate = req.body.startDate.split("-");
        routine.startDate = new Date(req.body.startDate[0], req.body.startDate[1]-1, req.body.startDate[2]);

        try {
            const errors = await RoutineController.update_routine(routine, req.body.id);

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
            await RoutineController.delete_routine(req.body.id);

            req.flash("success", "Routine successfully deleted!");
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    add_routine_task_handler: async (req, res, next) => {
        const userDate = new Date(req.body.userDate);
        // Get habit info from req body
        const habit = {
            name: req.body.name,
            description: (req.body.description.length) ? req.body.description : undefined,
            startDate: userDate,
        }
        if(req.body.startTime.length) {
            req.body.startTime = req.body.startTime.split(":");
            habit.startTime = new Date(userDate);
            habit.startTime.setHours(req.body.startTime[0]);
            habit.startTime.setMinutes(req.body.startTime[1]);
        }
        if(req.body.endTime.length) {
            req.body.endTime = req.body.endTime.split(":");
            habit.endTime = new Date(userDate);
            habit.endTime.setHours(req.body.endTime[0]);
            habit.endTime.setMinutes(req.body.endTime[1]);
        }

        try {
            // Send habit over to add function
            const errors = await RoutineController.add_routine_task(habit, req.body.id);
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
        const habit = {
            name: req.body.name,
            description: (req.body.description.length) ? req.body.description : undefined,
            startDate: userDate,
        }
        if(req.body.startTime.length) {
            req.body.startTime = req.body.startTime.split(":");
            habit.startTime = new Date(userDate);
            habit.startTime.setHours(req.body.startTime[0]);
            habit.startTime.setMinutes(req.body.startTime[1]);
        }
        if(req.body.endTime.length) {
            req.body.endTime = req.body.endTime.split(":");
            habit.endTime = new Date(userDate);
            habit.endTime.setHours(req.body.endTime[0]);
            habit.endTime.setMinutes(req.body.endTime[1]);
        }

        try {
            const errors = await RoutineController.update_routine_task(habit, req.body.id);
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

        // If errors in validation, return
        if(errors) {
            return errors;
        }

        // Create routine document in db (dont send habits)
        const habits = routine.habits;
        routine.habits = undefined;
        const dbRoutine = await Routine.create(routine);

        // For each habit in the routine, add it to the routine (this will handle habit creation and task creation and scheduling)
        for(let i = 0; i < habits.length; ++i) {
            await RoutineController.add_routine_task(habits[i], dbRoutine._id);
        }

        return undefined;
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
        if(routine.startDate != oldRoutine.startDate || routine.howOften != oldRoutine.howOften) {
            for(let i = 0; i < oldRoutine.habits.length; ++i) {
                const habit = await Habit.findById(oldRoutine.habits[i]);

                // Construct a proper habit object to send to habit controller, using habit info from db and updates to occurence and start
                const newHabit = {
                    name: habit.name,
                    description: habit.description,
                    startDate: routine.startDate,
                    howOften: routine.howOften,
                    startTime: habit.startTime,
                    endTime: habit.endTime,
                };

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

        // Delete all children
        for(let i = 0; i < routine.habits.length; ++i) {
            await HabitController.delete_habit(routine.habits[i]); // Use habit controller delete over routine task delete, since we dont need to remove id from child array (less db calls, the better). Should delete habit and all associated tasks
        }

        // Delete routine itself
        await Routine.findByIdAndDelete(routineID);
    },

    add_routine_task: async (habit, routineID) => {
        // Get routine from db for some data
        const routine = await Routine.findById(routineID);
        habit.howOften = routine.howOften;
        // Create habit with habit controller (handles validation, formatting, and db creation)
        const info = await HabitController.create_habit(habit);

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
                    habits: habitID
                }
            }
        )
    },

};

module.exports = RoutineController;