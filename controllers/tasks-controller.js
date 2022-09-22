// Task Controller: Handles basic CRUD operations for tasks, generates task page
const Task = require("../models/Task");

module.exports = {
    // Creates a new task
    // Received as POST request
    // Body contains: {
    //     name
    //     description (optional)
    //     date
    //     startTime (optional)
    //     endTime (optional)
    // }
    create_task: async (req,res,next) => {
        // Form task object from request
        req.body.date = req.body.date.split("-");
        const task = {
            name: req.body.name,
            date: new Date(req.body.date[0], req.body.date[1]-1, req.body.date[2]),
            owner: req.user.id
        };

        if(req.body.description) task.description = req.body.description;
        if(req.body.startTime) {
            req.body.startTime = req.body.startTime.split(":");
            task.startTime = new Date( task.date.getFullYear(), task.date.getMonth(), task.date.getDate(), req.body.startTime[0], req.body.startTime[1] );
        }
        if(req.body.endTime) {
            req.body.endTime = req.body.endTime.split(":");
            task.endTime = new Date( task.date.getFullYear(), task.date.getMonth(), task.date.getDate(), req.body.endTime[0], req.body.endTime[1] );
        }

        // Validate it
        const errors = validate_task(task);

        if(errors.length) {
            req.flash("errors", errors)
            return res.redirect("/tasks");
        }

        // Save it to database
        try{
            await Task.create(task);

            req.flash("success", "Task successfully created!");
            res.redirect("/tasks");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    update_task: async (req,res,next) => {
        const taskID = req.params.id;
        const updatedTask = {};
        
        if(req.body.date) req.body.date = req.body.date.split("-");

        try {
            // Want date for start and end time if user didnt adjust it
            const task = await Task.findById(taskID);

            if(req.body.name) updatedTask.name = req.body.name;
            if(req.body.description) updatedTask.description = req.body.description;
            (req.body.date) ? updatedTask.date = new Date(req.body.date[0], req.body.date[1]-1, req.body.date[2]) : updatedTask.date = task.date;
            if(req.body.startTime) {
                req.body.startTime = req.body.startTime.split(":");
                updatedTask.startTime = new Date( updatedTask.date.getFullYear(), updatedTask.date.getMonth(), updatedTask.date.getDate(), req.body.startTime[0], req.body.startTime[1] );
            }
            if(req.body.endTime) {
                req.body.endTime = req.body.endTime.split(":");
                updatedTask.endTime = new Date( updatedTask.date.getFullYear(), updatedTask.date.getMonth(), updatedTask.date.getDate(), req.body.endTime[0], req.body.endTime[1] );
            }

            const errors = validate_task(updatedTask);
            if(errors.length) {
                req.flash("errors", errors);
                return res.redirect("/tasks");
            }

            await Task.findByIdAndUpdate(taskID, updatedTask, {upsert:false});

            req.flash("success", "Task successfully updated");
            res.redirect("/tasks")
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    mark_complete: async (req,res,next) => {
        const taskID = req.params.id;
        try {
            await Task.findByIdAndUpdate(taskID, {completed: true}, {upsert:false});

            req.flash("success", "Task updated successfully");
            res.redirect("/tasks");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    mark_incomplete: async (req,res,next) => {
        const taskID = req.params.id;
        try {
            await Task.findByIdAndUpdate(taskID, {completed: false}, {upsert:false});

            req.flash("success", "Task updated successfully");
            res.redirect("/tasks");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    delete_task: async (req,res,next) => {
        const taskID = req.params.id;

        try {
            await Task.findByIdAndDelete(taskID);

            req.flash("success", "Task successfully deleted");
            res.redirect("/tasks");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    }
};

function validate_task(task) {
    const errors = [];
    const today = new Date(Date.now());
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

    return errors;
}