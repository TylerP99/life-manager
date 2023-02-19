const validator = require("validator");
const passport = require("passport");
const bcrypt = require("bcrypt");
const SaltRounds = 10;

const User = require("../models/User");
const Goal = require("../models/Goal");
const Routine = require("../models/Routine");
const Habit = require("../models/Habit");
const Task = require("../models/Task");

module.exports = {
    /*
        Serves signup page to user
    */
    get_signup_page: (req, res, next) => {
        res.render("users/signup.ejs");
    },
    
    /*
        Handles user creation. Validates user information (namely, that email is an email, email and username are unique, password is correct length, and password matches confirmation). If info is invalid, redirects back to signup page with error messages. If it is valid, email is normalized, password is hashed, and user info is saved in database. The user is redirected to dashboard.
    */
    create_new_user: async (req, res, next) => {
        // Get info from request
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            timezone: req.body.timezone,
        };
        // Init error object to send errors back to user
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
                return res.status(400).json(errors);
            }

            // Normalize the email according to validator specs
            user.email = validator.normalizeEmail(user.email, { gmail_remove_dots: false });

            // Store in db
            const newUser = await User.create(user);

            // Log user in with passport, redirect to dashboard
            req.logIn(newUser,(err) => {
                if(err) return next(err);
                return res.status(201).json({msg:"Success"});
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

    /*  
        Serves sign in page
    */
    get_signin_page: (req, res, next) => {
        res.render("users/signin.ejs");
    },

    /*
        Uses passport to authenticate the user. Checks if the entered email is filled and an email, then checks that the password is filled in. If there are issues, the user is sent to sign in with error messages. The email is then normalized and sent to passport with the password for authentication. Passport will return the user to the signin page if the credentials are invalid (email doesnt exist or password doesnt match), or it will log the user in and send them to dashboard if the credentials are good. 
    */
    authenticate_user: (req, res, next) => {
        // Check email and password fields have valid info (not empty)
        const errors = [];
        if(!validator.isEmail(req.body.email)) errors.push({ msg: "Enter a valid email." });
        if(validator.isEmpty(req.body.password)) errors.push({ msg: "Password cannot be empty." });

        if(errors.length) {
            req.flash("errors", errors);
            return res.status(400).json(errors);
            return res.redirect("/users/signin");
        }

        req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

        // Use passport authenticate function to log user in
        passport.authenticate("local", (err, user, info) => {
            if(err) return next(err);
            if(!user) {
                req.flash("errors", [info]);
                return res.status(401).json(info);
                return res.redirect("/users/signin");
            }
            req.logIn(user, (err) => {
                if(err) return next(err);
                req.flash("success", { msg: "You have been logged in!" });
                return res.status(200).json({msg:"Success"});
                return res.redirect(req.session.returnTo || "/dashboard");
            });
        })(req,res,next);
    },

    /*
        Sends forgot username page
    */
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

    /*
        Sends signout page
    */
    get_signout_page: (req, res, next) => {
        res.render("users/signout.ejs");
    },

    /*
        Uses passport logout function to log user out and send them to signin page
    */
    signout_user: (req, res, next) => {
        // Use the logout function and destroy the session
        req.logout((err) => {
            if(err) return next(err);
            res.redirect("/users/signin");
        });
    },

    /*
        Sends settings page
    */
    get_settings_page: (req, res, next) => {
        res.render("users/settings.ejs", {user: req.user});
    },

    /*
        Changes user's username to requested username. Username will come in the request body. Validates that the username is entered, then checks to make sure it isnt in use. If it does pass, user is sent back to settings page with error messages. If it is valid, user entry is updated and user is sent back to settings page with success message.
    */
    change_username: async (req, res, next) => {
        const errors = [];
        // Verify that username field is filled
        if(validator.isEmpty(req.body.username)) errors.push({msg: "Username field must be filled out."})
        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/users/settings");
        }
        try {
            // Verify that username doesn't already exist
            const existingName = await User.findOne({username: req.body.username});

            if(existingName) errors.push({msg: "A user with that name already exists."});
            if(errors.length) {
                req.flash("errors", errors);
                return res.redirect("/users/settings");
            }

            // Update user db entry
            await User.findByIdAndUpdate(req.user.id, {username: req.body.username});

            req.flash("success", "Username changed successfully.");
            res.redirect("/users/settings");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    change_user_email: async (req, res, next) => {
        // Verify that email field is filled and is an email
        if(!validator.isEmail(req.body.email)) {
            req.flash("errors", [{msg: "Enter a valid email."}]);
            return res.redirect("/users/settings");
        }


        try {
            // Verify email doesn't already exist
            const existingEmail = await User.findOne({email: req.body.email});
            if(existingEmail) {
                req.flash("errors", [{msg: "A user with that email already exists."}]);
                return res.redirect("/users/settings");   
            }

            // Update user db entry
            await User.findByIdAndUpdate(req.user.id, {email: req.body.email});
            req.flash("success", "Email successfully changed.");
            res.redirect("/users/settings");
        }
        catch(e) {
            console.error(e);
            next(e);
        }
    },
    change_user_password: async (req, res, next) => {
        const errors = [];

        // Verify password fields are filled (old, new, new conf)
        if(validator.isEmpty(req.body.oldPassword) || validator.isEmpty(req.body.newPassword) || validator.isEmpty(req.body.newPassword2)) errors.push({msg: "All fields must be filled out."});

        // Verify new password is strong
        if(!validator.isLength(req.body.newPassword, {min: 8})) errors.push({msg: "Password must be at least 8 characters in length."});

        // Verify passwords match
        if(req.body.newPassword !== req.body.newPassword2) errors.push({msg: "New passwords must match."});

        if(errors.length) {
            req.flash("errors", errors);
            return res.redirect("/users/settings");
        }

        try{
            // Verify old password matches db hash
            if(!await req.user.comparePassword(req.body.oldPassword)) errors.push({msg: "Old password is incorrect."});
            if(errors.length) {
                req.flash("errors", errors);
                return res.redirect("/users/settings");
            }

            // Change user db entry
            const hashed = await bcrypt.hash(req.body.newPassword, SaltRounds);
            await User.findByIdAndUpdate(req.user.id, {password: hashed});
            req.flash("success", "Password changed successfully.");
            res.redirect("/users/settings");
        }
        catch(e) {
            console.error(e);
            next(e);
        }

    },

    /*
        Deletes a user's account and all associated data. 

        @params: req.body {
            password
        }
        @returns: Undefined (redirects user to signin upon deletion)
    */
    delete_account: async (req, res, next) => {
        // Check password is correct
        console.log("Kap");
        console.log(req.user.comparePassword(req.body.password));
        if(!await req.user.comparePassword(req.body.password)) {
            req.flash("errors", [{msg: "Password is incorrect."}]);
            return res.redirect("/users/settings");
        }

        try {
            // Delete all the things
            await Goal.deleteMany({owner: req.user.id});
            await Routine.deleteMany({owner: req.user.id});
            await Habit.deleteMany({owner: req.user.id});
            await Task.deleteMany({owner: req.user.id});

            // Delete account
            await User.findByIdAndDelete(req.user.id);

            // Redirect to sign in
            req.flash("success", "Account successfully deleted.");
            res.redirect("/users/signin");
        }
        catch(e){
            console.error(e);
            next(e);
        }
    },  
}