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
            const complete = [];
            const overdue = [];
            const incomplete = [];

            const now = new Date(Date.now());
            const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

            // Split up tasks based on status
            tasks.forEach( x => {

                if(x.completed) { // If task is complete
                    complete.push(x);
                }
                else if((x.startTime && x.startTime <= now) || x.date <= yesterday) { // Task is overdue
                    console.log(`Name: ${x.name}\nStartTime: ${x.startTime}\nDate: ${x.date}\nnow: ${now}\nyesterday: ${yesterday}\nStartTime Check: ${x.startTime && x.startTime <= now}\nDate check: ${x.date <= yesterday}\n\n\n`);
                    overdue.push(x);
                }
                else {
                    incomplete.push(x);
                }
 
                
            });

            const taskSort = (a,b) => {
                if(a.date < b.date) return -1;
                if(b.date < a.date) return 1;

                if(a.startTime && !b.startTime) return -1;
                if(b.startTime && !a.startTime) return 1;

                if(a.startTime < b.startTime) return -1;
                if(b.startTime < a.startTime) return 1;

                return 0;
            };

            complete.sort(taskSort);
            incomplete.sort(taskSort);
            overdue.sort(taskSort);

            res.render("tasks.ejs",{tasks:incomplete, complete, overdue, user: req.user, DateTime: DateTime});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    get_habits_page: async (req, res, next) => {
        try{
            const habits = await Habit.find({owner: req.user.id});

            res.render("habits.ejs", {habits:habits, DateTime: DateTime, user: req.user});
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

            res.render("routines.ejs", {routines:routines, DateTime: DateTime, user: req.user});
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
            res.render("goals.ejs", {goals:goals, DateTime: DateTime, user: req.user});
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