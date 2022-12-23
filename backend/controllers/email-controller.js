const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    }
});

const {DateTime} = require("luxon");
const Task = require("../models/Task");
const User = require("../models/User");

const EmailController = {

    send_reminder: async (taskID) => {
        console.log("Send email function start")
        // Get task from db
        const task = await Task.findById(taskID);

        // Get user from db
        const user = await User.findById(task.owner);

        // Format message
        const greeting = `Hello ${user.username}!\n\n`;
        const content = "You have an upcoming task:" + 
                        "\n" + 
                        task.name +         
                        ((task.startTime) ? ` at ${DateTime.fromJSDate(task.startTime, {zone: user.timezone}).toLocaleString(DateTime.TIME_SIMPLE)}` : "") + 
                        " on " + 
                        DateTime.fromJSDate(task.date, {zone: user.timezone}).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) + 
                        ((task.description) ? "\n" + task.description : "" )
        const message = greeting + content;

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: user.email,
            subject: "Upcoming Task",
            text: message,
        };

        transporter.sendMail(mailOptions, async (err) => {
            if(err) {
                console.error(err);
            }
            else {
                console.log("Mail sent for: ");
                console.log(task);

                // This might change to become task reminder queue reliant, changing this without user interaction is weird to me. Plus, what if they change it?
                await Task.findByIdAndUpdate(taskID, {reminder: false}); // When a reminder is sent, set task to disallow reminders so additional emails are not sent on server reset
                console.log("Send mail end");
            }
        });

        
    },
    
};

module.exports = EmailController;