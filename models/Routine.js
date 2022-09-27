const mongoose = require("mongoose");

const RoutineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 250
    },
    tasks: {
        type: Array,
        default:[]
    },
    children: {
        type: Array,
        default: []
    },
    lastDate: {
        type: Date,
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {timestamps: true});

const Routine = mongoose.model("Routine", RoutineSchema);

module.exports = Routine;