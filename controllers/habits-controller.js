// Habits - Recurring Tasks
// Auto generates tasks (up to a year in advance)
// Can delete a Habit to delete all tasks associated with it
const Habit = require("../models/Habit");
const Task = require("../models/Task");

module.exports = {
    // Create new Habit
    create_new_habit: async (req, res, next) => {
        req.body.startDate = req.body.startDate.split("-");
        req.body.endDate = req.body.endDate.split("-");
        const habit = {
            name: req.body.name,
            startDate: new Date(req.body.startDate[0], req.body.startDate[1]-1, req.body.startDate[2]),
            endDate: new Date(req.body.endDate[0], req.body.endDate[1]-1, req.body.endDate[2]),
            howOften: {
                timeUnit: req.body.timeUnit,
                step: req.body.step
            },
            owner: req.user.id
        };

        if(req.body.description) habit.description = req.body.description;
        if(req.body.startTime) {
            req.body.startTime = req.body.startTime.split(":");
            habit.startTime = new Date(0, 0, 0, req.body.startTime[0], req.body.startTime[1] );
        }
        if(req.body.endTime) {
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

            let date = habit.startDate;
            let endDate = habit.endDate;
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
                        date.setDate(date.getDate() + habit.howOften.step*365);
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
    update_habit: (req, res, next) => {

    },
    // Delete existing Habit
    delete_habit: (req, res, next) => {

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