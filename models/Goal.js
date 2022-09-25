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
    who: {
        type: Array
    },
    where: {
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
    parent: {
        type: mongoose.Types.ObjectId
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

const Goal = mongoose.model("Goal", GoalSchema);

module.exports = Goal;