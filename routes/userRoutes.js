const express = require("express");

const {
    registerUser,
    loginUser,
    sendOTP,
    verifyOTP,
    sendUpdateProfileOTP,
    verifyUpdateProfileOTP,
    updateProfile,
    reportUser,
    getUserDBcopy,
} = require("../controllers/userController");

const updateRatings = require("../config/updateDB");


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/sendUpdateProfileOTP", sendUpdateProfileOTP);
router.post("/verifyUpdateProfileOTP", verifyUpdateProfileOTP);
router.patch("/updateProfile", updateProfile);
router.post("/report", reportUser);
router.get("/getDBcopy", getUserDBcopy);

router.post("/cron_update_db", updateRatings);

module.exports = router;