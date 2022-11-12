const mongoose = require("mongoose");

const TaskJobSchema = new mongoose.Schema({

    habitID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Habit",
    },

    jobDate: {
        type: Date,
        required: true,
    },

    taskDate: {
        type: Date,
        required: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },

}, {timestamps});

const TaskJob = mongoose.model("TaskJob", TaskJobSchema);

module.exports = TaskJob;