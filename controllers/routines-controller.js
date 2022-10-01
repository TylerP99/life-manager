const mongoose = require("mongoose");
const Routine = require("../models/Routine");
const Task = require("../models/Task");

module.exports = {

    create_new_routine: async (req, res, next) => {
        const routine = {
            name: req.body.routineName,
            tasks: [],
            children: [],
            owner: req.user.id,
        };
        let startingDate = req.body.startDate = req.body.startDate.split("-");
        startingDate = new Date(req.body.startDate[0], req.body.startDate[1]-1, req.body.startDate[2]);
        const errors = [];
        if(req.body.routineDescription.length) routine.description = req.body.routineDescription;

        if(!Array.isArray(req.body.name)) {
            req.body.name = [req.body.name];
            req.body.description = [req.body.description];
            req.body.startTime = [req.body.startTime];
            req.body.endTime = [req.body.endTime];
        }

        for(let i = 0; i < req.body.name.length; ++i) {
            const taskObject = {
                _id: new mongoose.Types.ObjectId(),
                task: undefined,
                children: []
            };
            req.body.startTime[i] = req.body.startTime[i].split(":");
            req.body.endTime[i] = req.body.endTime[i].split(":");
            const taskConstructor = _ => {
                return {
                    name: req.body.name[i],
                    description: (req.body.description[i] != "") ? req.body.description[i] : undefined,
                    startTime: new Date(0, 0, 0, req.body.startTime[i][0], req.body.startTime[i][1]),
                    endTime: new Date(0, 0, 0, req.body.endTime[i][0], req.body.endTime[i][1]),
                    owner: req.user.id,
                }
            }

            errors.push(...validate_task(taskConstructor()));
            if(errors.length) break;

            taskObject.task = taskConstructor;

            console.log(taskObject);
            routine.tasks.push(taskObject);
        }

        errors.push(...validate_routine(routine));

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/routines");
        }

        // For each task in the routine, make 50 tasks and push to array

        for(let i = 0; i < routine.tasks.length; ++i) {

            const startDate = new Date(startingDate);
            for(let j = 0; j < 50; j++) {
                const date = new Date(startDate);

                const task = routine.tasks[i].task();

                task.date = date;
                routine.tasks[i].children.push(task);

                startDate.setDate(startDate.getDate() + 1);
            }
            routine.lastDate = new Date(startDate);
            routine.tasks[i].task = routine.tasks[i].task();
        }

        try{
            // Add tasks to database
            for(let i = 0; i < routine.tasks.length; ++i) {
                routine.tasks[i].children = await Task.insertMany(routine.tasks[i].children);
                routine.tasks[i].children = routine.tasks[i].children.map( x => x._id);
            }

            // Add routine to database
            await Routine.create(routine);

            // Response
            req.flash("success", "Routine created successfully!");
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }

    },

    update_routine: async (req, res, next) => {
        const routineID = req.params.id;

        const updatedRoutine = {
            name: req.body.name,
            description: req.body.description
        };

        const errors = validate_routine(updatedRoutine);

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/routines");
        }

        try {
            await Routine.findByIdAndUpdate(routineID, updatedRoutine);

            req.flash("success", "Routine successfully updated!");
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    add_routine_task: async (req, res, next) => {
        const routineID = req.params.id;

        console.log("\n\n\n\n\n\n\nSTART DATE:");
        console.log(req.body.startDate)
        req.body.startTime = req.body.startTime.split(":");
        req.body.endTime = req.body.endTime.split(":");
        const taskConstructor = _ => {
            return {
                name: req.body.name,
                description: (req.body.description.length) ? req.body.description : undefined,
                startTime: new Date(0, 0, 0, req.body.startTime[0], req.body.startTime[1]),
                endTime: new Date(0, 0, 0, req.body.endTime[0], req.body.startTime[1]),
                owner:  req.user.id,
            };
        };
        const task = {
            _id: new mongoose.Types.ObjectId(),
            task: taskConstructor(),
            children: []
        }

        const errors = validate_task(task);

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/routines");
        }

        const startDate = new Date(req.body.startDate);
        for(let j = 0; j < 50; j++) {
            const date = new Date(startDate);

            const newTask = taskConstructor();
            newTask.date = date;
            task.children.push(newTask);

            startDate.setDate(startDate.getDate() + 1);
        }

        try{
            const tasks = await Task.insertMany(task.children);
            task.children = tasks.map(x => x._id);

            await Routine.findByIdAndUpdate(routineID,
                {
                    $push: {
                        tasks: task
                    }
                },
                { upsert:false }
            )

            req.flash("success", "Task added successfully");
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    update_routine_task: async (req, res, next) => {
        const routineID = req.params.id;
        const taskID = req.params.taskID;

        const updatedTask = {};

        if(req.body.name) updatedTask.name = req.body.name;
        if(req.body.description) updatedTask.description = req.body.description;
        if(req.body.startTime) updatedTask.startTime = req.body.startTime;
        if(req.body.endTime) updatedTask.endTime = req.body.endTime;

        const errors = validate_task(updatedTask);

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/routines");
        }

        try {
            const routine = await Routine.findById(routineID);
            const tasks = routine.tasks.find(x => x._id == taskID);

            await Task.updateMany({_id: {$in:tasks.children}, completed:false},updatedTask);

            await Routine.findByIdAndUpdate(routineID,
                {
                    $set: {
                        "tasks[target]": updatedTask
                    }
                },
                { 
                    upsert: false,
                    arrayFilters: [{"target._id": taskID}]
                }
            )

            req.flash("success", "Task successfully updated!");
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    delete_task: async (req, res, next) => {
        const routineID = req.params.id;
        const taskID = req.params.taskID;

        try{
            const routine = await Routine.findById(routineID);
            const tasks = routine.tasks.find(x => x._id == taskID);

            await Task.deleteMany({_id: {$in: tasks.children}});

            await Routine.findByIdAndUpdate(routineID,
                {
                    $pull: {
                        tasks: {
                            _id: new mongoose.mongo.ObjectId(taskID)
                        },
                    }
                },
                {upsert: false}
            );

            req.flash("success", "Task successfully deleted!");
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    delete_routine: async (req, res, next) => {
        // Get routine id from params
        const routineID = req.params.id;
        try {
            // Get routine from db
            const routine = await Routine.findById(routineID);

            // Delete all child tasks
            const children = [];
            for(let i = 0; i < routine.tasks.length; ++i) {
                children.push(...routine.tasks[i].children);
            }
            await Task.deleteMany({_id: {$in: children}});
            
            // Delete routine
            await Routine.findByIdAndDelete(routineID);

            // Respond
            req.flash("success", "Routine successfully deleted!");
            res.redirect("/routines");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
}

function validate_routine(routine) {
    const errors = [];
    return errors;
}

function validate_task(routine) {
    const errors = [];
    return errors;
}