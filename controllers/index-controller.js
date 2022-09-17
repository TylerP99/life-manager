// Index controller

const Task = require("../models/User");

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

            res.render("tasks.ejs",{tasks:tasks});
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    }
};