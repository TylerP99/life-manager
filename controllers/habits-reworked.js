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

    update_habit_handler: async (req, res, next) => {

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
                endTime: habit.endTime
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
        await Habit.create(habit);

        // Return errors
        return errors;
    },

    update_habit: async (updatedHabit, habitID) => {
        // Format updatedHabit dates and times

        // Validate updatedHabit

        // Get habit from database

        // If howOften was changed:
        // Need to delete child tasks
        // Need to create new set of tasks with new unit/step
        // Need to save new tasks into db
        // Need to save ids in habit object

        // Otherwise:
        // Edit all created child tasks
        // Update habit document

        // Respond

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
        return;
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

        // StartDate - Cannot start before current day

        // EndDate - Cannot end before startDate

        // howOften - IDK
        // Step

        // Time unit

        // startTime
        // endTime - Cannot end before startTime

        return errors;
    },

}