// Habits - Recurring Tasks
// Auto generates tasks (up to a year in advance)
// Can delete a Habit to delete all tasks associated with it
const Habit = require("../models/Habit");
const Task = require("../models/Task");

module.exports = {
    // Create new Habit
    create_new_habit: async (req, res, next) => {
        // Date comes in YYYY-MM-DD format, need to split for Date constructor
        req.body.startDate = req.body.startDate.split("-");
        req.body.endDate = req.body.endDate.split("-");
        const habit = {
            name: req.body.name,
            startDate: new Date(req.body.startDate[0], req.body.startDate[1]-1 /* Months are zero indexed */, req.body.startDate[2]),
            endDate: new Date(req.body.endDate[0], req.body.endDate[1]-1, req.body.endDate[2]),
            howOften: {
                timeUnit: req.body.timeUnit,
                step: req.body.step
            },
            owner: req.user.id
        };

        if(req.body.description.length) habit.description = req.body.description;
        if(req.body.startTime.length) {
            req.body.startTime = req.body.startTime.split(":");
            habit.startTime = new Date(0, 0, 0, req.body.startTime[0], req.body.startTime[1] );
        }
        if(req.body.endTime.length) {
            req.body.endTime = req.body.endTime.split(":");
            habit.endTime = new Date(0, 0, 0, req.body.endTime[0], req.body.endTime[1] );
        }

        const errors = validate_habit(habit);

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/habits");
        }

        try {            
            // Create template task
            const taskTemplate = function() {
                let newTask =  {
                        name: habit.name,
                        owner: req.user.id
                }
                return newTask;
            };

            let date = new Date(habit.startDate);
            let endDate = new Date(habit.endDate);
            let tasks = [];
            // Use habit in a loop to create tasks on desired dates, store in array
            while(date <= endDate) {
                const newTask = taskTemplate();


                newTask.date = new Date(date);

                if(habit.description) newTask.description = habit.description;
                if(habit.startTime) newTask.startTime = habit.startTime;
                if(habit.endTime) newTask.endTime = habit.endTime;

                tasks.push(newTask);

                switch(habit.howOften.timeUnit) {
                    case "day":
                        date.setDate(date.getDate() + habit.howOften.step*1);
                        break;
                    case "week":
                        date.setDate(date.getDate() + habit.howOften.step*7);
                        break;
                    case "month":
                        date.setMonth(date.getMonth() + habit.howOften.step*1);
                        break;
                    case "year":
                        date.setFullYear(date.getFullYear() + habit.howOften.step*1);
                        break;
                    default:
                        console.error("Invalid unit");
                        return res.render("/habits");
                }
            }


            console.log(tasks);

            // Send array to db
            let taskIDs = await Task.insertMany(tasks);
            taskIDs = taskIDs.map(x => x._id);

            habit.children = taskIDs;

            // Save habit in db
            await Habit.create(habit);

            // Send response
            req.flash("success", "Habit successfully created!");
            res.redirect("/habits");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    // Update existing Habit
    update_habit: async (req, res, next) => {
        // Form habit object
        const updatedHabit = {};

        console.log(req.body);

        if(req.body.name.length) updatedHabit.name = req.body.name; 
        if(req.body.description.length) updatedHabit.description = req.body.description; 
        if(req.body.startDate.length) {
            req.body.startDate = req.body.startDate.split("-");
            updatedHabit.startDate = new Date(req.body.startDate[0], req.body.startDate[1]-1, req.body.startDate[2]); 
        }
        if(req.body.endDate.length) {
            req.body.endDate = req.body.endDate.split("-");
            updatedHabit.endDate = new Date(req.body.endDate[0], req.body.endDate[1]-1, req.body.endDate[2]);
        }
        if(req.body.step.length) {
            updatedHabit.howOften = {};
            updatedHabit.howOften.step = req.body.step; 
        }
        if(req.body.timeUnit.length) {
            if(!updatedHabit.howOften) updatedHabit.howOften = {};
            updatedHabit.howOften.timeUnit = req.body.timeUnit; 
        }
        if(req.body.startTime.length) {
            req.body.startTime = req.body.startTime.split(":");
            updatedHabit.startTime = new Date(0, 0, 0, req.body.startTime[0], req.body.startTime[1] );
        }
        if(req.body.endTime.length) {
            req.body.endTime = req.body.endTime.split(":");
            updatedHabit.endTime = new Date(0, 0, 0, req.body.endTime[0], req.body.endTime[1] );
        }

        console.log(updatedHabit)

        // Validate habit object
        const errors = validate_habit(updatedHabit);

        if(errors.length) {
            req.flash("errors", errors);
            return res.render("/habits");
        }

        try {
            // Get old habit from db
            const oldHabit = await Habit.findById(req.params.id);

            // Get all associated tasks from db
            let tasks = await Task.find({_id: {$in: oldHabit.children}});
            
            // Filter out completed tasks
            tasks = tasks.reduce((filtered, x) => {
                if(!x.completed) filtered.push(x._id);
                return filtered;
            },[]);

            const taskTemplate = _ => {
                return {
                    name: updatedHabit.name || oldHabit.name,
                    description: updatedHabit.description || oldHabit.description || undefined,
                    startTime: updatedHabit.startTime || oldHabit.startTime || undefined,
                    endTime: updatedHabit.endTime || oldHabit.endTime || undefined,
                    owner: req.user.id
                };
            };

            // IF user wants to change occurence
            if(updatedHabit.startDate || updatedHabit.endDate || updatedHabit.howOften) {
                if(!updatedHabit.howOften) updatedHabit.howOften = oldHabit.howOften;
                if(!updatedHabit.howOften.step) updatedHabit.howOften.step = oldHabit.howOften.step;
                if(!updatedHabit.howOften.timeUnit) updatedHabit.howOften.timeUnit = oldHabit.howOften.timeUnit;

                // Delete all incomplete tasks
                await Task.deleteMany({_id: {$in: tasks}});

                // Make new tasks with updated habit
                let date = new Date(updatedHabit.startDate || oldHabit.startDate);
                const endDate = new Date(updatedHabit.endDate || oldHabit.endDate);
                let today = new Date(Date.now());
                let todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
                let newTasks = [];
                console.log(date,endDate,todayMidnight);
                while(date < endDate) {
                    if(date >= todayMidnight) {
                        const newTask = taskTemplate();
                        newTask.date = new Date(date);
                        newTasks.push(newTask);
                    }

                    switch(updatedHabit.howOften.timeUnit) {
                        case "day":
                            date.setDate(date.getDate() + updatedHabit.howOften.step*1);
                            break;
                        case "week":
                            date.setDate(date.getDate() + updatedHabit.howOften.step*7);
                            break;
                        case "month":
                            date.setMonth(date.getMonth() + updatedHabit.howOften.step*1);
                            break;
                        case "year":
                            date.setFullYear(date.getFullYear() + updatedHabit.howOften.step*1);
                            break;
                        default:
                            console.error("Invalid unit");
                            return res.render("/habits");
                    }
                }
                if(newTasks.length) newTasks = await Task.insertMany(newTasks);
                newTasks = newTasks.map( x => x._id);
                updatedHabit.children = newTasks;
            }
            else{
                // Otherwise, adjust all tasks with new properties only
                const updatedTask = taskTemplate();

                await Task.updateMany({_id: {$in: tasks}}, {$set:updatedTask}, {upsert:false});
            }

            await Habit.findByIdAndUpdate(req.params.id, {$set:updatedHabit}, {upsert:false});

            // Respond
            req.flash("success", "Successfully updated");
            res.redirect("/habits");
        }
        catch(e){
            console.error(e);
            next(e);
        }
    },
    // Delete existing Habit
    delete_habit: async (req, res, next) => {
        try{
            // Get habit to delete from db
            const habit = await Habit.findById(req.params.id);

            // Delete all associated tasks
            await Task.deleteMany({_id: {$in: habit.children}});

            // Delete habit
            await Habit.findByIdAndDelete(req.params.id);

            req.flash("success", "Successfully deleted!");
            res.redirect("/habits");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
}

function validate_habit(habit) {
    const errors = [];
    // Validate

    // Description (optional)

    // StartDate

    // EndDate (optional)

    // howOften

    // startTime (optional)

    // endTime (optional)
    return errors;
}