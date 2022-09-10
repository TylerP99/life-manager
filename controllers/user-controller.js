const validator = require("validator");
const User = require("../models/User");

module.exports = {
    get_signup_page: (req, res, next) => {
        res.render("users/signup.ejs");
    },
    create_new_user: (req, res, next) => {
        // Verify credentials are valid
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        const errors = [];

        try{
            // Email valid (and not empty)
            if(!validator.isEmail(user.email)) { errors.push({msg: "That is not a valid email."}) };
            // Password long enough (and not empty)
            if(!validator.isLength(user.password, {min:8})) { errors.push({msg: "Password must be at least 8 characters long."}) };
            // Password matches confirmation (and not empty)
            if(user.password !== req.body.password2) { errors.push({msg: "Passwords must match."}) };

            // Check if user exists
            const existingUser = await User.findOne({$or: [{email:user.email}, {username: user.username}]});
            if(existingUser) { errors.push({msg: "A user with that username or email already exists."}) };

            // If there are errors, reload signup with flash info
            if(errors.length) {
                req.flash("errors", errors);
                return res.redirect("/users/signup");
            }

            // Store in db
            const newUser = await User.create(user);

            req.logIn(newUser,(err) => {
                if(err) return next(err);
                res.redirect("/dashboard");
            });
            // Send user to verify email page
            //res.redirect("/user/verifyEmail");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
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