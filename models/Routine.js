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
    children: {
        type: Array,
        default: []
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {timestamps: true});

const Routine = mongoose.model("Routine", RoutineSchema);

module.exports = Routine;