// Index controller

const Task = require("../models/Task");
const Habit = require("../models/Habit");

module.exports = {
    get_landing_page: (req, res) => {
        res.render("landing.ejs");
    },
    get_dashboard: (req, res) => {
        res.render("dashboard.ejs");
    },
    get_tasks_page: async (req, res, next) => {
        // Get user's tasks
        try {
            const tasks = await Task.find({owner: req.user.id});
            const completed = [];
            const incomplete = [];

            tasks.forEach( x => (x.completed) ? completed.push(x) : incomplete.push(x));

            const taskSort = (a,b) => {
                if(a.date < b.date) return -1;
                if(b.date < a.date) return 1;

                if(a.startTime && !b.startTime) return -1;
                if(b.startTime && !a.startTime) return 1;

                if(a.startTime < b.startTime) return -1;
                if(b.startTime < a.startTime) return 1;

                return 0;
            };

            completed.sort(taskSort);
            incomplete.sort(taskSort);

            res.render("tasks.ejs",{tasks:tasks});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    get_habits_page: async (req, res, next) => {
        try{
            const habits = await Habit.find({owner: req.user.id});

            res.render("habits.ejs", {habits:habits});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
};