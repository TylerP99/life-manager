const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect(
        process.env.DB_STRING,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(_ => console.log("Connected to mongoDB"))
    .catch(e => console.error(e));
};

module.exports = connectDB;