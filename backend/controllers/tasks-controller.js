// Task Controller: Handles basic CRUD operations for tasks, generates task page
const Task = require("../models/Task");
const {DateTime} = require("luxon");

const JobController = require("./job-controller");

//
const TaskController = {

    /*******************************/
    /*   Task API Route Hanlders   */
    /*******************************/

    /*
    @desc:    Function directly called by router to create a new task
    @route:   POST /api/task/create
    @access:  Private
    */
    create_task_handler: async (req, res, next) => {

        const reqErrors = TaskController.validate_task_request(req.body);

        if(reqErrors.length) return res.status(400).json({errors: reqErrors});

        // Format request information into valid task object as shown in Task model (just make them have same datatype)
        let task = TaskController.format_task_request_form(req.body, req.user);

        try{
            // Validate task object
            const errors = TaskController.validate_task(task);

            // If errors, respond
            if(errors.length) {
                return res.status(400).json({errors});
            }

            // Create task in db
            task = await TaskController.create_task(task);

            // Respond with created task
            return res.status(201).json({task});

        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
    @desc:    Function directly called by router to get all of a target user's tasks
    @route:   GET /api/task/get
    @access:  Private
    */
    get_user_tasks_handler: async (req, res, next) => {
        try {
            // Get tasks from db whose owner field is the same as the requesting user id
            const tasks = await Task.find({owner: req.user.id});

            // Send a response with tasks
            return res.status(200).json({tasks});
        }
        catch(e) {
            console.log("Get user task function error");
            next(e);
        }
    },

    /*
    @desc:    Function directly called by router to update a targeted task
    @route:   PUT /api/task/update/:id
    @access:  Private
    */
    update_task_handler: async (req, res, next) => {

        const id = req.params.id;

        const reqErrs = TaskController.validate_task_request(req.body);
        if(reqErrs.length) return res.status(400).json({errors: reqErrs});

        // Format request (client should send a full object)
        let task = TaskController.format_task_request_form(req.body, req.user);

        try{
            // Validate task object
            const errors = TaskController.validate_task(task);

            // If there are validation errors, respond
            if(errors.length) {
                return res.status(400).json({errors});
            }

            // Update task in db
            task = await TaskController.update_task(task, id);

            // Respond with updated task
            return res.status(200).json({task});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
    @desc:    Function directly called by router to update a targeted task by changing its complete field to true
    @route:   PUT /api/task/markComplete/:id
    @access:  Private
    */
    mark_complete_handler: async (req, res, next) => {
        const id = req.params.id;

        try{
            const task = await Task.findByIdAndUpdate(id, {completed: true}, {new: true});
            return res.status(200).json({task});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
    @desc:    Function directly called by router to update a targeted task by changing its complete field to false
    @route:   PUT /api/task/markIncomplete/:id
    @access:  Private
    */
    mark_incomplete_handler: async (req, res, next) => {
        const id = req.params.id;

        try{
            const task = await Task.findByIdAndUpdate(id, {completed: false}, {new: true});
            return res.status(200).json({task});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
    @desc:    Function directly called by router to delete a targeted task
    @route:   DELETE /api/task/delete/:id
    @access:  Private
    */
    delete_task_handler: async (req, res, next) => {
        const id = req.params.id;

        try {

            const task = await TaskController.delete_task(id);
            return res.status(200).json({task});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    /*
    @desc:    Creates a new task document within the db. If the reminder flag is set on the incoming task, also calls for a reminder to be scheduled.
    @params:  task: Formatted task object
    @returns: If there are errors, returns an array of errors. If there are no errors, returns the task document
    */
    create_task: async (task) => {
        // Add task to db
        const newTask = await Task.create(task);

        // Schedule reminder
        if(newTask.reminder) {
            await JobController.schedule_reminder(newTask);
        }

        return newTask; // Success
    },
    /*
    @desc:    Updates a specified task within the database. If the task date has been updated, requests for the reminder to be updated as well.
    @params:  task: The updated task object
              id: The id of the task to be updated
    @returns: The updated document if the operation is successful, or an array of errors otherwise.
    */
    update_task: async (task, id) => {
        const oldTask = await Task.findById(id);
        const newTask = await Task.findByIdAndUpdate(id, task, {new: true});

        if(oldTask.date != task.date) {
            await JobController.update_reminder(task);
        }

        return newTask;
    },

    /*
    @desc:     Deletes a target task from the db
    @params:   id: id of task to delete
    @returns:  If there are errors, returns an array of errors. If the deletion is successful, returns the deleted task
    */
    delete_task: async (id) => {
        const errors = [];

        const task = await Task.findById(id);

        if(!task) errors.push({message: "Task not found"});
        if(task.owner !== req.user.id) errors.push({message: "Unauthorized"})

        await Task.findByIdAndDelete(id);

        return task;
    },

    /*
    @desc:    Creates a task object from request information and formats date/time information into proper JS date objects
    @params:  requestBody: Incoming request body data
              requestUser: User object tied to request
    @returns: Formatted task object
    */
    format_task_request_form: (requestBody, requestUser) => {
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

    /*
    @desc:    Validates a task request, ensuring that required fields are present before creating a task object
    @params:  reqBody: Incoming request body
    @returns: An array containing any errors, or an empty array if all fields pass
    */
    validate_task_request: (reqBody) => {
        const {name, date} = reqBody;
        const reqErrs = [];

        if(!name || !name.length) reqErrs.push({message: "Name field required"});
        if(!date || !date.length) reqErrs.push({message: "Date field required"});

        return reqErrs;
    },

    /*
    @desc:    Validates a formatted task object, ensuring each field meets certain requirments
    @params:  task: Formatted task object
    @returns: An array containing any errors found during validation. This array is empty if the task passes all checks
    */
    validate_task: (task) => {
        console.log("Validate task function start")
        const errors = [];
        const today = new Date(Date.now()); // This will fuck with timezones, fix soon
        today.setDate(today.getDate() -1 );
        // Check name
        // Verify name is at most 50 characters
        if(task.name && task.name.length > 50) errors.push({message: "Name can not exceed 50 characters."});
    
        // Check description
        // Verify description is at most 250 characters
        if(task.description && task.description.length > 250) errors.push({message: "Description can not exceed 250 characters."});
    
        // Check date
        // Verify date is on or after today
        // Date must have a year equal to or greater than current year
        if( task.date && ( task.date.getFullYear() < today.getFullYear() || // Year is before current year
        (task.date.getFullYear() == today.getFullYear() && task.date.getMonth() < today.getMonth()) || // Year is current year, but month is before current month
        (task.date.getFullYear() == today.getFullYear() && task.date.getMonth() == today.getMonth() && task.date.getDate() < today.getDate()) ) ) { // Year is current year, month is current month, date is before current date
            errors.push({message: "Date must be on or after the current date."});
        }
        // Check startTime
        // Check endTime
        // Verify startTime is before endTime
        if( (task.startTime && task.endTime) && (task.startTime.getHours() > task.endTime.getHours() ||
        (task.startTime.getHours() == task.endTime.getHours() && task.startTime.getMinutes() > task.endTime.getMinutes() ) ) ) {
            errors.push({message: "Start time must be before end time."});
        }
    
        console.log("Validate task function end")
        return errors;
    },
};


module.exports = TaskController;