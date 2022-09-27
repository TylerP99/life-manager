const Routine = require("../models/Routine");
const Task = require("../models/Task");

module.exports = {

    create_new_routine: (req, res, next) => {
        const routine = {
            name: req.body.routineName,
            tasks: [],
            children: [],
            owner: req.user.id,
        };
        let startDate = req.body.startDate = req.body.startDate.split("-");
        startDate = new Date(req.body.startDate[0], req.body.startDate[1]-1, req.body.startDate[2]);
        const errors = [];
        if(req.body.description.length) routine.description = req.body.description;

        for(let i = 0; i < req.body.name.length; ++i) {
            const task = {
                name: req.body.name[i],
                startTime: req.body.startTime[i],
                endTime: req.body.endTime[i],
                owner: req.user.id,
            }
            if(req.body.description[i].length) task.description = req.body.description[i];

            errors = validate_task(task);
            if(errors.length) break;

            routine.tasks.push(task);
        }

        errors.push(...validate_routine(routine));

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/routines");
        }

        // For each task in the routine, make 50 tasks and push to array

        routine.tasks.forEach(x => {
            const startDate = new Date(startDate);
            for(let i = 0; i < 50; i++) {
                const date = new Date(req.body.startDate);
                const task = Object.create(x);
                task.date = date;
                routine.children.push(task);

                startDate.setDate(startDate.getDate() + 1);
            }
        });

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

    update_routine: (req, res, next) => {

    },

    delete_routine: (req, res, next) => {

    },
}