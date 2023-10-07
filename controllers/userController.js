const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const LeaderBoard = require("../models/ranklistModel");
const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    // { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } 

    const { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;

    console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!name || !email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    if (!codechef_id && !leetcode_id && !codeforces_id && !github_id) {
        return next(new ErrorHander("Enter atleast one platform details", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        codechef_id,
        codeforces_id,
        leetcode_id,
        github_id,
    });


    res.json({
        "success": true,
        "message": `User (${user.email}) Registered Successfully!!`
    })

});


// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;


    console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!name || !email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    if (!codechef_id && !leetcode_id && !codeforces_id && !github_id) {
        return next(new ErrorHander("Enter atleast one platform details", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        codechef_id,
        codeforces_id,
        leetcode_id,
        github_id,
        avatar: "https://www.nicepng.com/png/detail/804-8049853_med-boukrima-specialist-webmaster-php-e-commerce-web.png"
    });


    res.json({
        "success": true,
        "message": `User (${user.email}) Registered Successfully!!`
    })

});


// send OTP to email id of registered User
exports.sendOTP = catchAsyncErrors(async (req, res, next) => {

    const { email } = req.body;

    console.log("email recieved for OTP: ", email);

    if (!email) {
        return next(new ErrorHander("Email ID not found", 400));
    }


    const sendEmail = async (userEmail) => {

        const transporter = nodeMailer.createTransport({
            // host: process.env.SMPT_HOST,
            port: process.env.SMPT_PORT,
            service: process.env.SMPT_SERVICE,
            secure: true,
            logger: true,
            debug: true,
            secureConnection: false,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD,
            },
            tls:{
                rejectUnAuthorized: false
            }
        });

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: userEmail,
            subject: 'Rcoem Coderz - Email Verification',
            text: 'Your OTP is 9576'
        };

        await transporter.sendMail(mailOptions);
    };

    await sendEmail(email);

    console.log('Email sent successfully');

    res.json({
        "success": true,
        "message": `OTP sent successfully!!`
    })

});


// verify OTP sent to email id of registered User
exports.verifyOTP = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;


    console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!name || !email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    if (!codechef_id && !leetcode_id && !codeforces_id && !github_id) {
        return next(new ErrorHander("Enter atleast one platform details", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        codechef_id,
        codeforces_id,
        leetcode_id,
        github_id,
        avatar: "https://www.nicepng.com/png/detail/804-8049853_med-boukrima-specialist-webmaster-php-e-commerce-web.png"
    });


    res.json({
        "success": true,
        "message": `User (${user.email}) Registered Successfully!!`
    })

});


// get profile data for profile page
exports.getProfile = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;


    console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!name || !email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    if (!codechef_id && !leetcode_id && !codeforces_id && !github_id) {
        return next(new ErrorHander("Enter atleast one platform details", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        codechef_id,
        codeforces_id,
        leetcode_id,
        github_id,
        avatar: "https://www.nicepng.com/png/detail/804-8049853_med-boukrima-specialist-webmaster-php-e-commerce-web.png"
    });


    res.json({
        "success": true,
        "message": `User (${user.email}) Registered Successfully!!`
    })

});


// update profile data for profile page
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;


    console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!name || !email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    if (!codechef_id && !leetcode_id && !codeforces_id && !github_id) {
        return next(new ErrorHander("Enter atleast one platform details", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        codechef_id,
        codeforces_id,
        leetcode_id,
        github_id,
        avatar: "https://www.nicepng.com/png/detail/804-8049853_med-boukrima-specialist-webmaster-php-e-commerce-web.png"
    });


    res.json({
        "success": true,
        "message": `User (${user.email}) Registered Successfully!!`
    })

});


// forgot password - set new password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;


    console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!name || !email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    if (!codechef_id && !leetcode_id && !codeforces_id && !github_id) {
        return next(new ErrorHander("Enter atleast one platform details", 400));
    }

    const user = await User.create({
        name,
        email,
        password,
        codechef_id,
        codeforces_id,
        leetcode_id,
        github_id,
        avatar: "https://www.nicepng.com/png/detail/804-8049853_med-boukrima-specialist-webmaster-php-e-commerce-web.png"
    });


    res.json({
        "success": true,
        "message": `User (${user.email}) Registered Successfully!!`
    })

});



