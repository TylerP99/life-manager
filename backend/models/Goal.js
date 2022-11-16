const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 250
    },
    participants: {
        type: Array
    },
    location: {
        type: String
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    tasks: {
        type: Array,
        default: []
    },
    habits: {
        type: Array,
        default: []
    },
    routines: {
        type: Array,
        default: []
    },
    goals: {
        type: Array,
        default: []
    },   
    parent: { // Handles subgoal deletion
        type: mongoose.Types.ObjectId,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
},{timestamps:true});

const Goal = mongoose.model("Goal", GoalSchema);

module.exports = Goal;