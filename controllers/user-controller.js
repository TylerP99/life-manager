module.exports = {
    get_signup_page: (req, res, next) => {
        res.render("users/signup.ejs");
    },
    create_new_user: (req, res, next) => {
        // Verify credentials are valid

        // Store in db

        // Send user to verify email page
    },
    get_signin_page: (req, res, next) => {
        res.render("users/signin.ejs");
    },
    authenticate_user: (req, res, next) => {
        // Check email and password fields have valid info (not empty)

        // Use passport authenticate function to log user in
    },
    get_forgot_username_page: (req, res, next) => {
        res.render("users/forgot-username.ejs");
    },
    forgot_username_request: (req, res, next) => {
        // Send an email to the requested email if it exists
    },
    get_forgot_password_page: (req, res, next) => {
        res.render("users/forgot-password.ejs");
    },
    forgot_password_request: (req, res, next) => {
        // Send an email to user email if the email exists
    },
    get_forgot_password_change_page: (req, res, next) => {
        res.render("users/change-password.ejs");
    },
    forgot_password_change_request: (req, res, next) => {
        // Change the password
    },
    get_signout_page: (req, res, next) => {
        res.render("users/signout.ejs");
    },
    signout_user: (req, res, next) => {
        // Use the logout function and destroy the session
    },
    get_settings_page: (req, res, next) => {
        res.render("users/settings.ejs");
    },
    change_user_info: (req, res, next) => {
        // Change users entered info in db
    }
}