
const Goal = require("../models/Goal");
const Routine = require("../models/Routine");
const Habit = require("../models/Habit");
const Task = require("../models/Task");

module.exports = {

    create_new_goal: async (req, res, next) => {
        req.body.startDate = req.body.startDate.split("-");
        req.body.endDate = req.body.endDate.split("-");
        const goal = {
            name: req.body.name,
            description: req.body.description,
            startDate: new Date(req.body.startDate[0], req.body.startDate[1]-1, req.body.startDate[2]),
            endDate: new Date(req.body.endDate[0], req.body.endDate[1]-1, req.body.endDate[2]),
            participants: (Array.isArray(req.body.participants)) ? req.body.participants : [req.body.participants],
            location: req.body.location,
            owner: req.user.id,
        };

        const errors = []//validate_goal(goal);

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/goals");
        }

        try{
            await Goal.create(goal);

            req.flash("success", "Goal successfully created! Now add a new task, habit, or routine to your new goal!");
            res.redirect("/goals");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },

    add_new_task: async (req, res, next) => {

    },

    add_new_habit_goal: async (req, res, next) => {

    },

    add_new_routine_goal: async (req, res, next) => {

    },

    update_goal: async (req, res, next) => {

    },

    update_task: async (req, res, next) => {

    },

    update_habit: async (req, res, next) => {

    },

    update_routine: async (req, res, next) => {

    },

    delete_goal: async (req, res, next) => {

    },

    delete_task: async (req, res, next) => {

    },

    delete_habit: async (req, res, next) => {

    },

    delete_routine: async (req, res, next) => {

    },

};