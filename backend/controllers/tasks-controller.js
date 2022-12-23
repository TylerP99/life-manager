// Task Controller: Handles basic CRUD operations for tasks, generates task page
const Task = require("../models/Task");
const {DateTime} = require("luxon");

const JobController = require("./job-controller");

//
const TaskController = {

    /*
        Task API Route Hanlders
    */
    create_task_handler: async (req, res, next) => {
        console.log("Create task request started")

        // Format request information into valid task object as shown in Task model (just make them have same datatype)
        const task = TaskController.format_task_request_form(req.body, req.user);

        try{
            // Create Task in DB (Returns errors if task doesnt pass validation)
            const errors = await TaskController.create_task(task);

            // Respond
            if(errors) { // If there were errors, save them for client side display
                req.flash("errors", errors);
            }
            else { // Otherwise, save a success message
                req.flash("success", "Task successfully created!");
            }

            console.log("Create task request ending")

            // Redirect to page to force a reload and display updated info
            res.redirect("/tasks")
        }
        catch(e) {
            console.error("Create task request error")
            console.error(e);
            next(e);
        }
    },
    /*
        Receives client side PUT request and sends response
        Request body should contain a full task object (minimum name and date)
    */
    update_task_handler: async (req, res, next) => {

        console.log("Update task request start")

        // Format request (client should send a new object)
        const task = TaskController.format_task_request_form(req.body, req.user);
        const id = req.params.id;

        try{
            // Call action function
            const errors = await TaskController.update_task(task, id);

            // Respond
            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Task successfully updated");
            }

            console.log("Update task request end")

            res.redirect("/tasks");
        }
        catch(e) {
            console.log("Update task request error")
            console.error(e);
            next(e);
        }
    },
    mark_complete_handler: async (req, res, next) => {

        console.log("Mark task complete request start")

        const id = req.params.id;

        try{
            const task = await Task.findByIdAndUpdate(id, {completed: true});

            // Respond
            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Task successfully updated");
            }

            console.log("Mark task complete request end")

            res.redirect("/tasks");
        }
        catch(e) {
            console.log("Mark task complete request error")
            console.error(e);
            next(e);
        }
    },
    mark_incomplete_handler: async (req, res, next) => {

        console.log("Mark task incomplete request start")

        const update = { completed: false };
        const id = req.params.id;

        try{
            const task = await Task.findByIdAndUpdate(id, {completed: true});

            // Respond
            if(errors) {
                req.flash("errors", errors);
            }
            else {
                req.flash("success", "Task successfully updated");
            }

            console.log("Mark task incomplete request end")

            res.redirect("/tasks");
        }
        catch(e) {
            console.log("Mark task incomplete request error")
            console.error(e);
            next(e);
        }
    },
    delete_task_handler: async (req, res, next) => {
        console.log("Delete task request start")

        const id = req.params.id;

        try {
            await TaskController.delete_task(id);

            console.log("Delete task request end")

            res.redirect("/tasks");
        }
        catch(e) {
            console.log("Delete task request error")
            console.error(e);
            next(e);
        }
    },

    /*
        Creates a new task in database
    */
    create_task: async (task) => {
        console.log("Create task function start")

        // Validate task
        const errors = TaskController.validate_task(task);

        if(errors.length) { // If there are errors during validation, return here and dont add task
            console.log("Create task function error")
            return errors;
        }

        // Add task to db
        const newTask = await Task.create(task);

        // Schedule reminder
        if(newTask.reminder) {
            await JobController.schedule_reminder(newTask);
        }

        console.log("Create task function end")

        return newTask; // Success
    },
    /*
        Updates a target task in database
        @params:
            - task: An object containing task items to update
            - id: A mongoDB id associated to a task document in the database
        @returns:
            An array of error messages if there are errors, or undefined if the provided task is valid
    */
    update_task: async (task, id) => {
        console.log("Update task function start")
        const errors = TaskController.validate_task(task);

        if(errors.length) {
            console.log("Update task function errors")
            return errors;
        }

        const oldTask = await Task.findByIdAndUpdate(id, task);
        console.log(task, oldTask);

        if(oldTask.date != task.date) {
            await JobController.update_reminder(task);
        }

        console.log("Update task function end")
        return undefined;
    },
    delete_task: async (id) => {
        console.log("Delete task function start")
        await Task.findByIdAndDelete(id);
        console.log("Delete task function end")
        return undefined;
    },

    format_task_request_form: (requestBody, requestUser) => {
        console.log("Format task function start")
        // Format request information into valid task object as shown in Task model (just make them have same datatype)
        requestBody.date = requestBody.date.split("-"); // Currently, date is received as YYYY-MM-DD
        const task = {
            name: requestBody.name,
            owner: requestUser.id,
        };
        // Set date information
        // Want the task date to be midnight in user's timezone

        task.date = DateTime.fromObject(
            {
                year: requestBody.date[0],
                month: requestBody.date[1],
                day: requestBody.date[2],
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0
            },
            {
                zone: requestUser.timezone,
            }
        );
        task.date = task.date.toJSDate();

        if(requestBody.description.length) task.description = requestBody.description;

        // If Start/End times provided, format and store as date obj
        if(requestBody.startTime.length) {
            requestBody.startTime = requestBody.startTime.split(":");
            task.startTime = new Date(task.date); // New date from midnight user time
            task.startTime.setHours(task.startTime.getHours() + Number(requestBody.startTime[0]));
            task.startTime.setMinutes(task.startTime.getMinutes() + Number(requestBody.startTime[1]));
        }
        if(requestBody.endTime.length) {
            requestBody.endTime = requestBody.endTime.split(":");
            task.endTime = new Date(task.date);
            task.endTime.setHours(task.endTime.getHours() + Number(requestBody.endTime[0]));
            task.endTime.setMinutes(task.endTime.getMinutes() + Number(requestBody.endTime[1]));
        }

        console.log("Format task function end")
        return task;
    },
    validate_task: (task) => {
        console.log("Validate task function start")
        const errors = [];
        const today = new Date(Date.now()); // This will fuck with timezones, fix soon
        today.setDate(today.getDate() -1 );
        // Check name
        // Verify name is at most 50 characters
        if(task.name && task.name.length > 50) errors.push({msg: "Name can't be more than 50 characters long."});
    
        // Check description
        // Verify description is at most 250 characters
        if(task.description && task.description.length > 250) errors.push({msg: "Description can't be more than 250 characters long."});
    
        // Check date
        // Verify date is on or after today
        // Date must have a year equal to or greater than current year
        if( task.date && ( task.date.getFullYear() < today.getFullYear() || // Year is before current year
        (task.date.getFullYear() == today.getFullYear() && task.date.getMonth() < today.getMonth()) || // Year is current year, but month is before current month
        (task.date.getFullYear() == today.getFullYear() && task.date.getMonth() == today.getMonth() && task.date.getDate() < today.getDate()) ) ) { // Year is current year, month is current month, date is before current date
            errors.push({msg: "Date must be on or after the current date."});
        }
        // Check startTime
        // Check endTime
        // Verify startTime is before endTime
        if( (task.startTime && task.endTime) && (task.startTime.getHours() > task.endTime.getHours() ||
        (task.startTime.getHours() == task.endTime.getHours() && task.startTime.getMinutes() > task.endTime.getMinutes() ) ) ) {
            errors.push({msg: "Start time must be before end time."});
        }
    
        console.log("Validate task function end")
        return errors;
    },
};


module.exports = TaskController;