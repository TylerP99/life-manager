const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user-controller");
const { forwardIfAuthenticated, ensureAuthenticated } = require("../middleware/auth");

// Sign up page
router.get("/signup", forwardIfAuthenticated, UserController.get_signup_page);

// Sign up request
router.post("/create", UserController.create_new_user);

// Sign in page
router.get("/signin", forwardIfAuthenticated, UserController.get_signin_page);

// Authenticate
router.post("/authenticate", UserController.authenticate_user);

// Forgot username page
router.get("/forgotUsername", UserController.get_forgot_username_page);

// Forgot username request
router.post("/forgotUsername", UserController.forgot_username_request);

// Forgot password page
router.get("/forgotPassword", forwardIfAuthenticated, UserController.get_forgot_password_page);

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
router.get("/settings", ensureAuthenticated, UserController.get_settings_page);

// Change username
router.put("/settings/update/username", UserController.change_username);

// Change email
router.put("/settings/update/email", UserController.change_user_email);

// Change password
router.put("/settings/update/password", UserController.change_user_password);

// Delete account
router.delete("/settings/delete", UserController.delete_account);

module.exports = router;