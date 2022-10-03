const validator = require("validator");
const User = require("../models/User");
const passport = require("passport");

module.exports = {
    get_signup_page: (req, res, next) => {
        res.render("users/signup.ejs");
    },
    create_new_user: async (req, res, next) => {
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
                console.log("Errors");
                console.log(errors);
                req.flash("errors", errors);
                return res.redirect("/users/signup");
            }

            user.email = validator.normalizeEmail(user.email, { gmail_remove_dots: false });

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
        const errors = [];
        if(!validator.isEmail(req.body.email)) errors.push({ msg: "Enter a valid email." });
        if(validator.isEmpty(req.body.password)) errors.push({ msg: "Password cannot be empty." });

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/users/signin");
        }

        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

        // Use passport authenticate function to log user in
        passport.authenticate("local", (err, user, info) => {
            if(err) return next(err);
            if(!user) {
                req.flash("errors", [info]);
                return res.redirect("/users/signin");
            }
            req.logIn(user, (err) => {
                if(err) return next(err);
                req.flash("success", { msg: "You have been logged in!" });
                return res.redirect(req.session.returnTo || "/dashboard");
            });
        })(req,res,next);
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
        req.logout((err) => {
            if(err) return next(err);
            res.redirect("/users/signin");
        });
    },
    get_settings_page: (req, res, next) => {
        res.render("users/settings.ejs");
    },
    change_user_info: (req, res, next) => {
        // Change users entered info in db
    }
}