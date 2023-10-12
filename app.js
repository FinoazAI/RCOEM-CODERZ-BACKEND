const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

const errorMiddleware = require("./middlewares/error");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config();
}


app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://rcoem-coderz.netlify.app', 
        'https://rcoem-coderz.netlify.app/', 
        'https://rcoem-coderz.netlify.app/*', 
        'https://indian-coderz.netlify.app', 
        'https://indian-coderz.netlify.app/', 
        'https://indian-coderz.netlify.app/*', 
        '*'
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
}));


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


// Route Imports
const user = require("./routes/userRoutes");
const leaderboard = require("./routes/leaderboardRoutes");


app.use("/api/v1", user);
app.use("/api/v1/leaderboard", leaderboard);



app.get("*", (req, res) => {
    res.send("Hello");
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;