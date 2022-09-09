module.exports = {
    get_landing_page: (req, res) => {
        res.render("landing.ejs");
    },
    get_dashboard: (req, res) => {
        res.render("dashboard.ejs");
    }
};