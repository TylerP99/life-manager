const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user-controller");

// Sign up page
router.get("/signup", UserController.get_signup_page);

// Sign up request
router.post("/create", UserController.create_new_user);

// Sign in page
router.get("/signin", UserController.get_signin_page);

// Authenticate
router.post("/authenticate", UserController.authenticate_user);

// Forgot username page
router.get("/forgotUsername", UserController.get_forgot_username_page);

// Forgot username request
router.post("/forgotUsername", UserController.forgot_username_request);

// Forgot password page
router.get("/forgotPassword", UserController.get_forgot_password_page);

// Forgot password request
router.post("/forgotPassword", UserController.forgot_password_request);

// Forgot password change page
router.get("/forgotPassword/change", UserController.get_forgot_password_change_page);

// Forgot password change request
router.put("/forgotPassword/change", UserController.forgot_password_change_request);

// Sign out page
router.get("/signout", UserController.get_signout_page);

// Sign out request
router.post("/signout", UserController.signout_user);

// User settings
router.get("/settings", UserController.get_settings_page);

// Change user information
router.put("/settings/edit", UserController.change_user_info);

module.exports = router;