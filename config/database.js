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

            // const UpdateIntervalTime = 43200000;
            const UpdateIntervalTime = 4 * 60 * 60 * 1000;

            setInterval(() => {

                updateRatings();

            }, UpdateIntervalTime)
        });
};


module.exports = connectDatabase;