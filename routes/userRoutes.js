const express = require("express");

const {
    registerUser,
    getLeaderboard
} = require("../controllers/userController");


const router = express.Router();


router.post("/register", registerUser);
router.get("/leaderboard", getLeaderboard);


module.exports = router;