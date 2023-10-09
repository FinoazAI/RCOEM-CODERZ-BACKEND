const express = require("express");

const {
    registerUser,
    loginUser,
    sendOTP,
    verifyOTP,
    sendUpdateProfileOTP,
    verifyUpdateProfileOTP,
    updateProfile,
    reportUser
} = require("../controllers/userController");


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/sendUpdateProfileOTP", sendUpdateProfileOTP);
router.post("/verifyUpdateProfileOTP", verifyUpdateProfileOTP);
router.patch("/updateProfile", updateProfile);
router.post("/report", reportUser);


module.exports = router;