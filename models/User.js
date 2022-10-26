const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    }
},{timestamps:true});


// Middleware (hash password before saving in db)
UserSchema.pre("save", async function save(next) {
    const user = this;

    if(!user.isModified("password")) {return next();} // Check if the password has been changed and, if not, move on

    try{
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        user.password = hashedPassword;
        next();
    }
    catch(e) {
        console.error(e);
        next(e);
    }
});

// Password compare function
UserSchema.methods.comparePassword = async function comparePassword(password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;