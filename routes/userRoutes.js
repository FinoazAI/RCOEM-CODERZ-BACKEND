const express = require("express");

const {
    registerUser,
    loginUser,
    sendOTP,
    verifyOTP,
    getProfile,
    forgotPassword,
    updateProfile
} = require("../controllers/userController");


const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/profile", getProfile);
router.post("/updateProfile", updateProfile);
router.post("/forgotPassword", forgotPassword);


module.exports = router;