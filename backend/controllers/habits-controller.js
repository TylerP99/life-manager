/*

    A reworked version of habits. Why am I reworking this? I want to iron down habits, so I can rebuild routines using habits instead of just tasks, since a routine is just a set of habits. I also want to add in scheduling so that habit tasks are automatically created each day/week. This will allow me to allow habits without an end date and can recur forever.

    The basic idea: build out a habit like before, where a task template is used. This time, make 50 tasks ahead of time. At the end, schedule the next task to be created. The function that is scheduled will create the task, then schedule the next one. 

*/

const Task = require("../models/Task");
const Habit = require("../models/Habit");
const TaskJob = require("../models/TaskJob");

const JobController = require("../controllers/job-controller");

const { DateTime } = require("luxon");

const HabitController = {

    /*
        Handles the habit creation route. Receives a request with habit information, 
        sends that information to the create_habit function, then responds to the
        creation request. 
    */
    create_habit_handler: async (req, res, next) => {
        const habit = HabitController.format_habit_request_form(req.body, req.user);

        try {
            const errors = await HabitController.create_habit(habit, req.user.timezone);

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
        const updatedHabit = HabitController.format_habit_request_form(req.body, req.user);

        try {
            const errors = await HabitController.update_habit(updatedHabit, req.params.id, req.user.timezone);

            if(errors) {
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
            await HabitController.delete_habit(req.params.id);
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

        @parameters:
            - habit: A formatted habit object following habit schema
        @returns:
            - Habit upon successful creation, or an array of errors if that habit failed validation.
    */
    create_habit: async (habit, tz) => {
        const MAX_TASKS = 50;

        // Validate passed habit
        const errors = HabitController.validate_habit(habit);

        // If there are errors, return them
        if(errors.length) return errors;

        const storedHabit = await Habit.create(habit);

        // Create tasks for habit, up to 50
        const taskConstructor = _ => {
            return {
                name: habit.name,
                description: habit.description,
                startTime: habit.startTime,
                endTime: habit.endTime,
                owner: habit.owner,
            };
        };

        let tasks = await HabitController.create_habit_tasks(storedHabit, taskConstructor, tz);

        // Add all tasks to database
        tasks = await Task.insertMany(tasks);

        // Schedule task reminders
        for(let i = 0; i < tasks.length; ++i) {
            await JobController.schedule_reminder(tasks[i]);
        }

        // Save ids of inserted tasks
        tasks = tasks.map(x => x._id);

        // Add habit to database
        await Habit.findByIdAndUpdate(storedHabit._id, {children: tasks});

        // Return errors
        return storedHabit;
    },

    /*
        Takes a habit object and a habit's id to update.

        @parameters:
            - updatedHabit: A formatted habit object containing the minimum items required based on the habit schema.
            - habitID: A unqiue ID of a habit stored in the database.
        @returns:
            - Undefined upon successful update, or an array of errors if the habit failed validation
    */
    update_habit: async (updatedHabit, habitID, tz) => {
        // Validate updatedHabit
        const errors = HabitController.validate_habit(updatedHabit);

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
                endTime: updatedHabit.endTime,
                owner: updatedHabit.owner,
            };
        };

        // If howOften was changed:
        if(updatedHabit.howOften.step != habit.howOften.step || updatedHabit.howOften.timeUnit != habit.howOften.timeUnit || updatedHabit.startDate != habit.startDate) {
            // Need to delete child tasks
            await Task.deleteMany({_id: {$in: habit.children}});

            // Need to create new set of tasks with new unit/step
            let tasks = await HabitController.create_habit_tasks(updatedHabit, updatedTask, tz);

            // Need to save new tasks into db
            tasks = await Task.insertMany(tasks);

            // Update reminders
            for(let i = 0; i < tasks.length; ++i) {
                await JobController.schedule_reminder(tasks[i]);
            }

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

        @parameters:
            - habitID: A MongoDB unique ID tied to the specific habit to delete.
        @returns:
            - Undefined upon successful deletion (Mongoose will throw an error if there is a mongoose issue)
    */
    delete_habit: async (habitID) => {
        // Get habit from the database
        const habit = await Habit.findById(habitID);

        if(!habit) return;

        // Delete all child tasks
        await Task.deleteMany({_id: {$in: habit.children}});

        // Delete habit job
        await TaskJob.findOneAndDelete({habitID: habitID});

        // Cancel task creation job
        await JobController.delete_task_scheduler(habit);

        // Delete habit
        await Habit.findByIdAndDelete(habitID);

        // Done
        return undefined;
    },

    /*
        @desc:    Given a habit, this function handles the recurring tasks for that habit. It will create up to 50 tasks, or stop if the habit end date is reached. Also begins the task creation scheduler for the given habit. Returns the habits back to the calling function for storage in the database.
        
        @params:  habit: A habit object
                  taskConstructor: A function that returns a task object using the habit information
        
        @returns: An array of tasks
    */
    create_habit_tasks: async (habit, taskConstructor, tz) => {
        const MAX_TASKS = 50;

        // Get a date representing today at midnight in user's timezone
        const today = DateTime.fromObject({hour: 0, minute: 0, second: 0, millisecond: 0}, {zone: tz}).toJSDate();

        // If the provided startDate is before today at midnight, change the startDate to today at midnight
        let currentDate = (habit.startDate < today) ? DateTime.fromJSDate(today) : DateTime.fromJSDate(habit.startDate);

        // Create task array to store tasks and return
        let tasks = [];

        // Create tasks up to and including the provided endDate, or up to MAX_TASKS
        for(let i = 0; i < MAX_TASKS && currentDate <= habit.endDate; ++i) {
            // Create a task with constructor
            const newTask = taskConstructor();

            // Set the date to current date
            newTask.date = currentDate.toJSDate();

            if(newTask.startTime) {
                newTask.startTime = new Date(newTask.date.getFullYear(), newTask.date.getMonth(), newTask.date.getDate(), newTask.startTime.getHours(), newTask.startTime.getMinutes());
            }
            if(newTask.endTime) {
                newTask.endTime = new Date(newTask.date.getFullYear(), newTask.date.getMonth(), newTask.date.getDate(), newTask.endTime.getHours(), newTask.endTime.getMinutes());
            }

            // Add task to task array
            tasks.push(newTask);

            // Increment current date using step data
            switch(habit.howOften.timeUnit) {
                case "minute":
                    currentDate = currentDate.plus({ minutes: 1*habit.howOften.step});
                    break;
                case "hour":
                    currentDate = currentDate.plus({ hours: 1*habit.howOften.step });
                    break;
                case "day":
                    currentDate = currentDate.plus({days: 1*habit.howOften.step});
                    break;
                case "week":
                    currentDate = currentDate.plus({ weeks: 1*habit.howOften.step });
                    break;
                case "month":
                    currentDate = currentDate.plus({ months: 1*habit.howOften.step });
                    break;
                case "year":
                    currentDate = currentDate.plus({ years: 1*habit.howOften.step });
                    break;
                default:
                    console.log("Incorrect step option");
                    break;
            }
        }

        // If current date is still below endDate, schedule a new task to be created on the date of the first task
        if(currentDate <= habit.endDate) {
            await JobController.schedule_task(tasks[0].date, currentDate.toJSDate(), habit._id);
        }

        return tasks;
    },

    /*
        Checks each habit property and makes sure it follows requirements. 
        Returns back an error array with messages describing errors for the
        user.

        @parameters:
            - habit: A formatted habit object
        @returns:
            - An error array containing issues with input habit, or an empty array if there are none.
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
        if((habit.startDate && habit.endDate) && (habit.endDate <= habit.startDate)) {
            errors.push({msg: "Habit ending date must come after starting date."});
        }

        // startTime
        // endTime - Cannot end before startTime
        if((habit.endTime && habit.startTime) && (habit.endTime <= habit.startTime)) {
            errors.push({msg: "Habit ending time must come after starting time."});
        }

        return errors;
    },

    /*
        Takes in request information from client side form entry, returns a formatted habit object ready for validation
        Used during habit creation and updates
        @parameters:
            - requestBody: the body object from the request, containing form info from client
            - requestUser: the user object tied to incoming request, need for user's id
        @returns:
            - habit: A formatted habit object, with name, howOften, owner, startDate, and endDate set to user entered information, or default information. Also includes a start and end time and description if the user entered these.
    */
    format_habit_request_form: (requestBody, requestUser) => {
        // Populate habit object with required fields first
        const habit = {
            name: requestBody.name,
            howOften: {
                timeUnit: requestBody.timeUnit,
                step: requestBody.step,
            },
            owner: requestUser.id,
        };

        const userDate = new Date(requestBody.userDate);

        // If the user entered a description, add it
        if(requestBody.description.length) {
            habit.description = requestBody.description;
        }

        // Format starting date
        if(requestBody.startDate.length) { // If a startDate was provided, set startDate to that at midnight
            requestBody.startDate = requestBody.startDate.split("-");
            habit.startDate = DateTime.fromObject(
                {
                    year: requestBody.startDate[0], 
                    month: requestBody.startDate[1], 
                    day: requestBody.startDate[2],
                    hour: 0, minute: 0, second: 0, millisecond: 0,
                }, 
                { zone: requestUser.timezone });
        }
        else { // Otherwise, set startDate to today at midnight
            habit.startDate = DateTime.fromObject({hour: 0, minute: 0, second: 0, millisecond: 0}, {zone: requestUser.timezone});
        }
        habit.startDate = habit.startDate.toJSDate();

        // Format ending date
        if(requestBody.endDate.length) { // If a endDate was provided, set endDate to that at midnight
            requestBody.endDate = requestBody.endDate.split("-");
            habit.endDate = DateTime.fromObject(
                {
                    year: requestBody.endDate[0], 
                    month: requestBody.endDate[1], 
                    day: requestBody.endDate[2],
                    hour: 0, minute: 0, second: 0, millisecond: 0,
                }, 
                { zone: requestUser.timezone });
        }
        else { // Otherwise, set endDate to 100 years from startDate at midnight
            habit.endDate = DateTime.fromJSDate(new Date(habit.startDate.getFullYear() + 100, habit.startDate.getMonth(), habit.startDate.getDate(),0,0,0,0), {zone: requestUser.timezone});
        }
        habit.endDate = habit.endDate.toJSDate();

        // Format starting date
        if(requestBody.startTime.length) {
            requestBody.startTime = requestBody.startTime.split(":");
            habit.startTime = DateTime.fromJSDate(habit.startDate);
            habit.startTime = habit.startTime.plus({ hours: requestBody.startTime[0], minutes: requestBody.startTime[1] });
            habit.startTime = habit.startTime.toJSDate();
        }

        // Format ending time
        if(requestBody.endTime.length) {
            requestBody.endTime = requestBody.endTime.split(":");
            habit.endTime = DateTime.fromJSDate(habit.startDate);
            habit.endTime = habit.endTime.plus({ hours: requestBody.endTime[0], minutes: requestBody.endTime[1] });
            habit.endTime = habit.endTime.toJSDate();
        }

        console.log("Habit Formatted: ");
        console.log(habit);
        return habit;
    },

}

module.exports = HabitController;