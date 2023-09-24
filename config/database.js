const mongoose = require("mongoose");
const updateRatings = require("./updateDB");

const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((data) => {
            console.log(`Mongodb connected with server`);

            updateRatings();
        });
};

module.exports = connectDatabase;