module.exports = {
    get_signup_page: (req, res, next) => {
        res.render("users/signup.ejs");
    },
    create_new_user: (req, res, next) => {

    },
    get_signin_page: (req, res, next) => {
        res.render("users/signin.ejs");
    },
    authenticate_user: (req, res, next) => {

    },
    get_forgot_username_page: (req, res, next) => {
        res.render("users/forgot-username.ejs");
    },
    forgot_username_request: (req, res, next) => {

    },
    get_forgot_password_page: (req, res, next) => {
        res.render("users/forgot-password.ejs");
    },
    forgot_password_request: (req, res, next) => {

    },
    get_forgot_password_change_page: (req, res, next) => {
        res.render("users/change-password.ejs");
    },
    forgot_password_change_request: (req, res, next) => {

    },
    get_signout_page: (req, res, next) => {
        res.render("users/signout.ejs");
    },
    signout_user: (req, res, next) => {

    },
    get_settings_page: (req, res, next) => {
        res.render("users/settings.ejs");
    },
    change_user_info: (req, res, next) => {

    }
}