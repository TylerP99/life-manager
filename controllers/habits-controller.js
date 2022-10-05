/*

    A reworked version of habits. Why am I reworking this? I want to iron down habits, so I can rebuild routines using habits instead of just tasks, since a routine is just a set of habits. I also want to add in scheduling so that habit tasks are automatically created each day/week. This will allow me to allow habits without an end date and can recur forever.

    The basic idea: build out a habit like before, where a task template is used. This time, make 50 tasks ahead of time. At the end, schedule the next task to be created. The function that is scheduled will create the task, then schedule the next one. 

*/

const Task = require("../models/Task");
const Habit = require("../models/Habit");

module.exports = {

    /*
        Handles the habit creation route. Receives a request with habit information, 
        sends that information to the create_habit function, then responds to the
        creation request. 
    */
    create_habit_handler: async (req, res, next) => {
        const habit = {
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            howOften: {
                step: req.body.step,
                unit: req.body.timeUnit,
            },
            owner: req.user.id,
        };

        try {
            const errors = await this.create_habit(habit);

            if(errors.length) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Habit successfully created!");
            }

            res.redirect("/habits");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
        Handles habit update route. Recieves new habit in request (fields are prefilled).
        Sends habit object to update function. If there are errors, respond with error flash.
        Otherwise sends success flash.
    */
    update_habit_handler: async (req, res, next) => {
        const updatedHabit = {
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            howOften: {
                step: req.body.step,
                unit: req.body.timeUnit,
            },
            owner: req.user.id,
        };

        try {
            const errors = await this.update_habit(updatedHabit, req.params.id);

            if(errors.length) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Habit successfully updated");
            }

            res.redirect("/habits");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
        Handles habit deletion route. Receives the habit to delete in query params.
        Sends id to delete_habit function, where all tasks related to the habit and 
        the habit itself are deleted. Then responds with success.
    */
    delete_habit_handler: async (req, res, next) => {
        try{
            await this.delete_habit(req.params.id);
            req.flash("success", "Habit successfully deleted");
            res.redirect("/habits");
        }
        catch(e) {
            console.log(e);
            next(e);
        }
    },

    /*
        Handles habit creation and database storage. Formats habit request information and
        sends that habit to a validation function. If the habit is invalid, sends errors back
        to caller. If the habit is valid, function creates tasks from the start date until 
        the end date, up to 50 tasks ahead of time. (Coming soon: Sets a scheduled call to 
        create a new task when the first task is set to expire.) Stores all tasks in database,
        stores these ids in the habit document, saves habit to db, and returns empty error array.
    */
    create_habit: async (habit) => {
        const MAX_TASKS = 50;

        // Format date/time from form
        if(habit.startDate) {
            habit.startDate = habit.startDate.split("-");
            habit.startDate = new Date(habit.startDate[0], habit.startDate[1]-1, habit.startDate[2]);
        }
        if(habit.endDate) {
            habit.endDate = habit.endDate.split("-");
            habit.endDate = new Date(habit.endDate[0], habit.endDate[1]-1, habit.endDate[2]);
        }
        if(habit.startTime) {
            habit.startTime = habit.startTime.split(":");
            habit.startTime = new Date(habit.startDate.getFullYear(), habit.startDate.getMonth(), habit.startDate.getDate(), habit.startTime[0], habit.startTime[1]);
        }
        if(habit.endTime) {
            habit.endTime = habit.endTime.split(":");
            habit.endTime = new Date(habit.startDate.getFullYear(), habit.startDate.getMonth(), habit.startDate.getDate(), habit.endTime[0], habit.endTime[1]);
        }

        if(habit.endDate == undefined) {
            habit.endDate = new Date(habit.startDate);
            habit.endDate.setFullYear(habit.endDate.getFullYear() + 100); // If no end date is provided, set to 100 years after startDate.
        }

        // Validate passed habit
        const errors = validate_habit(habit);

        // If there are errors, return them
        if(errors.length) return errors;

        // Create tasks for habit, up to 50
        const taskConstructor = _ => {
            return {
                name: habit.name,
                description: habit.description,
                startTime: habit.startTime,
                endTime: habit.endTime,
                owner: req.user.id,
            };
        };

        const currentDate = new Date(habit.startDate);
        const tasks = [];

        for(let i = 0; i < MAX_TASKS && currentDate <= habit.endDate; ++i) {
            const newTask = taskConstructor();
            newTask.date = new Date(currentDate);

            tasks.push(newTask);

            // Increment current date using step data
            switch(habit.timeUnit) {
                case "minute":
                    currentDate.setMinutes(currentDate.getMinutes() + habit.step);
                    break;
                case "hour":
                    currentDate.setHours(currentDate.getHours() + habit.step);
                    break;
                case "day":
                    currentDate.setDate(currentDate.getDate() + habit.step);
                    break;
                case "week":
                    currentDate.setDate(currentDate.getDate() + 7*habit.step);
                    break;
                case "month":
                    currentDate.setMonth(currentDate.getMonth() + habit.step);
                    break;
                case "year":
                    currentDate.setFullYear(currentDate.getFullYear() + habit.step);
                    break;
            }
        }

        // Add all tasks to database
        tasks = await Task.insertMany(tasks);
        // Save ids of inserted tasks
        tasks = tasks.map(x => x._id);

        // Add ids to children
        habit.children = tasks;

        // Add habit to database
        const storedHabit = await Habit.create(habit);

        // Return errors
        return storedHabit;
    },

    update_habit: async (updatedHabit, habitID) => {
        // Format date/time from form
        if(updatedHabit.startDate) {
            updatedHabit.startDate = updatedHabit.startDate.split("-");
            updatedHabit.startDate = new Date(updatedHabit.startDate[0], updatedHabit.startDate[1]-1, updatedHabit.startDate[2]);
        }
        if(updatedHabit.endDate) {
            updatedHabit.endDate = updatedHabit.endDate.split("-");
            updatedHabit.endDate = new Date(updatedHabit.endDate[0], updatedHabit.endDate[1]-1, updatedHabit.endDate[2]);
        }
        if(updatedHabit.startTime) {
            updatedHabit.startTime = updatedHabit.startTime.split(":");
            updatedHabit.startTime = new Date(updatedHabit.startDate.getFullYear(), updatedHabit.startDate.getMonth(), updatedHabit.startDate.getDate(), updatedHabit.startTime[0], updatedHabit.startTime[1]);
        }
        if(updatedHabit.endTime) {
            updatedHabit.endTime = updatedHabit.endTime.split(":");
            updatedHabit.endTime = new Date(updatedHabit.startDate.getFullYear(), updatedHabit.startDate.getMonth(), updatedHabit.startDate.getDate(), updatedHabit.endTime[0], updatedHabit.endTime[1]);
        }

        // If there is no endDate, set it to 100 years in the future so it appears to be a never ending habit
        if(updatedHabit.endDate == undefined) {
            updatedHabit.endDate = new Date(updatedHabit.startDate);
            updatedHabit.endDate.setFullYear(updatedHabit.endDate.getFullYear() + 100);
        }

        // Validate updatedHabit
        const errors = this.validate_habit(updatedHabit);

        if(errors.length) {
            return errors;
        }

        // Get habit from database
        const habit = await Habit.findById(habitID);

        // New task constructor for use in either scenario below
        const updatedTask = _ => {
            return {
                name: updatedHabit.name,
                description: updatedHabit.description,
                startTime: updatedHabit.startTime,
                endTime: updatedHabit.endTime
            };
        };

        // If howOften was changed:
        if(updatedHabit.howOften.step != habit.howOften.step || updatedHabit.howOften.timeUnit != habit.howOften.timeUnit || updatedHabit.startDate != habit.startDate) {
            // Need to delete child tasks
            await Task.deleteMany({_id: {$in: habit.children}});

            // Need to create new set of tasks with new unit/step
            const today = new Date(); // Set to client side date grab?
            const currentDate = (updatedHabit.startDate < today) ? today : new Date(updatedHabit.startDate);
            const tasks = [];
            for(let i = 0; i < 50 && currentDate <= updatedHabit.endDate; ++i) {
                const newTask = updatedTask();
                newTask.date = new Date(currentDate);

                tasks.push(newTask);

                // Increment current date using step data
                switch(updatedHabit.timeUnit) {
                    case "minute":
                        currentDate.setMinutes(currentDate.getMinutes() + updatedHabit.step);
                        break;
                    case "hour":
                        currentDate.setHours(currentDate.getHours() + updatedHabit.step);
                        break;
                    case "day":
                        currentDate.setDate(currentDate.getDate() + updatedHabit.step);
                        break;
                    case "week":
                        currentDate.setDate(currentDate.getDate() + 7*updatedHabit.step);
                        break;
                    case "month":
                        currentDate.setMonth(currentDate.getMonth() + updatedHabit.step);
                        break;
                    case "year":
                        currentDate.setFullYear(currentDate.getFullYear() + updatedHabit.step);
                        break;
                }
            }

            // Need to save new tasks into db
            tasks = await Tasks.insertMany(tasks);
            tasks = tasks.map(x => x._id);
            updatedHabit.children = tasks;
        }
        // Otherwise:
        else {
            // Edit all created child tasks
            await Task.updateMany({_id: {$in: habit.children}}, updatedTask());
        }

        // Update habit document
        await Habit.findByIdAndUpdate(habitID, updatedHabit);

        return undefined;
    },

    /*
        Handles the process of habit deletion. Gets the habit from the database,
        deletes all child tasks, then deletes the parent habit. (Depending on how
        job scheduling works, may also need to delete scheduled jobs here.)
    */
    delete_habit: async (habitID) => {
        // Get habit from the database
        const habit = await Habit.findById(habitID);

        // Delete all child tasks
        await Task.deleteMany({_id: {$in: habit.children}});

        // Delete habit
        await Habit.findByIdAndDelete(habitID);

        // Done
        return undefined;
    },

    /*
        Checks each habit property and makes sure it follows requirements. 
        Returns back an error array with messages describing errors for the
        user.
    */
    validate_habit: (habit) => {
        const SHORT_MAX = 50;
        const LONG_MAX = 250;
        const errors = [];

        // Name
        if(habit.name == undefined || habit.name.length == 0) {
            errors.push({msg: "Habit requires a name."});
        }
        if(habit.name.length > SHORT_MAX) {
            errors.push({msg: `Habit name cannot exceed ${SHORT_MAX} characters.`});
        }

        // Description
        if(habit.description?.length > LONG_MAX) {
            errors.push({msg: `Habit description cannot exceed ${LONG_MAX} characters`});
        }

        // StartDate
        // EndDate - Cannot end before startDate
        if(habit.endDate <= habit.startDate) {
            errors.push({msg: "Habit ending date must come after starting date."});
        }

        // startTime
        // endTime - Cannot end before startTime
        if(habit.endTime <= habit.startTime) {
            errors.push({msg: "Habit ending time must come after starting time."});
        }

        return errors;
    },

}