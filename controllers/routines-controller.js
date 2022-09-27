const Routine = require("../models/Routine");
const Task = require("../models/Task");

module.exports = {

    create_new_routine: async (req, res, next) => {
        console.log(req.body);
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
            req.body.startTime[i] = req.body.startTime[i].split(":");
            req.body.endTime[i] = req.body.endTime[i].split(":");
            const task = {
                name: req.body.name[i],
                startTime: new Date(0, 0, 0, req.body.startTime[i][0], req.body.startTime[i][1]),
                endTime: new Date(0, 0, 0, req.body.endTime[i][0], req.body.endTime[i][1]),
                owner: req.user.id,
            }
            if(req.body.description[i].length) task.description = req.body.description[i];

            errors.push(...validate_task(task));
            if(errors.length) break;

            routine.tasks.push(task);
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

                const task = JSON.parse(JSON.stringify(routine.tasks[i])); // Deep object copy

                task.date = date;
                routine.children.push(task);

                startDate.setDate(startDate.getDate() + 1);
            }
            routine.lastDate = new Date(startDate);
        }

        console.log(routine.children);

        try{
            // Add tasks to database
            routine.children = await Task.insertMany(routine.children);

            // Get task ids, place in children
            routine.children = routine.children.map(x => x._id);

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

    },

    delete_routine: async (req, res, next) => {
        // Get routine id from params
        const routineID = req.params.id;
        try {
            // Get routine from db
            const routine = await Routine.findById(routineID);

            // Delete all child tasks
            await Task.deleteMany({_id: {$in: routine.children}});
            
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