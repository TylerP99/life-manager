const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 250
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
},{timestamps:true});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;