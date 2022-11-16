const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 250
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    howOften: {
        type: Object,
        required: true
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    children: {
        type: Array,
        default: []
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
},{timestamps:true});

const Habit = mongoose.model("Habit", HabitSchema);

module.exports = Habit;