// Index controller

const Task = require("../models/Task");
const Habit = require("../models/Habit");
const Routine = require("../models/Routine");
const Goal = require("../models/Goal");

const { DateTime } = require("luxon");

module.exports = {
    get_landing_page: async (req, res) => {
        res.render("landing.ejs");
    },
    get_dashboard: async (req, res) => {
        // Get all the things
        const goals = await Goal.find({owner: req.user.id});
        const tasks = await Task.find({owner: req.user.id});
        res.render("dashboard.ejs", {tasks: tasks, goals: goals});
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

            res.render("tasks.ejs",{tasks:incomplete, complete:completed, user: req.user, DateTime: DateTime});
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
    get_routines_page: async (req, res, next) => {
        try{
            const routines = await Routine.find({owner: req.user.id});
            
            for(let i = 0; i < routines.length; ++i) {
                routines[i].habits = await Habit.find({_id: {$in: routines[i].habits}});
            }

            console.log(routines);

            res.render("routines.ejs", {routines:routines});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    get_goals_page: async (req, res, next) => {
        try{
            const goals = await Goal.find({owner: req.user.id});
                
            for(let i = 0; i < goals.length; ++i) {
                goals[i].tasks = await Task.find({_id: {$in: goals[i].tasks}});
                goals[i].habits = await Habit.find({_id: {$in: goals[i].habits}});
                goals[i].routines = await Routine.find({_id: {$in: goals[i].routines}});
                for(let j = 0; j < goals[i].routines.length; ++i) {
                    goals[i].routines[j].habits = await Habit.find({_id: {$in: goals[i].routines[j].habits}});
                }
                goals[i].goals = goals.filter(x => goals.includes(x._id));
            }
            res.render("goals.ejs", {goals:goals});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    get_goal_creation_page: async (req, res, next) => {
        res.render("create-goal.ejs");
    },

};