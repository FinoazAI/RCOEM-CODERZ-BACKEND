const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const LeaderBoard = require("../models/ranklistModel");
const OtpModel = require("../models/otpModel");
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

    const { email, password } = req.body;

    console.log("data : ", email, password);

    if (!email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    const user = await User.findOne({ "email": email });

    if (user && user.password==password) {

        res.json({
            "success": true,
            "isvalid": true,
            "password": user.password,
            "github_id": user.github_id,
            "codechef_id": user.codechef_id,
            "codeforces_id": user.codeforces_id,
            "leetcode_id": user.leetcode_id,
            "message": `Credentials verified successfully!!`
        })

    }
    else {

        res.json({
            "success": true,
            "isvalid": false,
            "message": `Invalid Credentials`
        })

    }



});





// send OTP to email id of registered User
exports.sendOTP = catchAsyncErrors(async (req, res, next) => {

    const { email } = req.body;

    console.log("email recieved for OTP: ", email);

    if (!email) {
        return next(new ErrorHander("Email ID not found", 400));
    }


    const regUser = await User.findOne({ "email": email });

    if (regUser) {
        res.json({
            "success": false,
            "message": `User already registered!!`
        })
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
            tls: {
                rejectUnAuthorized: false
            }
        });


        let user = await OtpModel.findOne({ "email": userEmail });

        if (!user) {

            const x = await OtpModel.create({
                email: userEmail
            });
        }

        user = await OtpModel.findOne({ "email": userEmail });

        user.generateOTP();

        await user.save({ validateBeforeSave: false });

        const OTP = user.emailVerificationOTP;

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: userEmail,
            subject: 'OTP - Rcoem Coderz',
            text: `Heyy coder, your One Time Password (OTP) for email verification is ${OTP}. Thank You!!!`
        };

        await transporter.sendMail(mailOptions);

        // console.log("email sent");
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

    const { email, otp } = req.body;

    console.log("data recieved: ", email, otp);

    if (!email || !otp) {
        return next(new ErrorHander("Sufficient data not found", 400));
    }

    const user = await OtpModel.findOne({ "email": email });

    if (!user) {
        return next(new ErrorHander("No user/OTP found", 400));
    }

    console.log("user: ", user)

    let isValid = await user.verifyOTP(otp);

    // await user.save({ validateBeforeSave: false });

    console.log("isvalid: ", isValid)

    if (isValid) {
        res.json({
            "success": true,
            "isvalid": true,
            "message": `Rknec email id verified successfully `
        })
    }
    else {
        res.json({
            "success": true,
            "isvalid": false,
            "message": `Invalid/Expired OTP`
        })
    }

    res.json({
        "success": false,
        "message": `Email validation failed`
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

    const { email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;


    console.log(email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!email || !password || !codechef_id || !leetcode_id || !codeforces_id || !github_id) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    const user = await User.findOneAndUpdate({"email": email}, {
        email,
        password,
        codechef_id,
        codeforces_id,
        leetcode_id,
        github_id,
    });


    res.json({
        "success": true,
        "message": `User (${user.email}) details updated successfully!!`
    })

});



// forgot password - set new password
exports.reportUser = catchAsyncErrors(async (req, res, next) => {

    console.log(11111)

    const { name, email, reporter, codechef, codeforces, leetcode, github } = req.body;

    console.log(name, email, reporter, codechef, codeforces, leetcode, github);

    if (!name || !email || !reporter || !codechef || !codeforces || !leetcode || !github) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }


    const data = {
        "reported_against_name": name, 
        "reported_by_name": reporter,
        "reported_by_email": email,
        "is_codechef_invalid": codechef, 
        "is_codeforces_invalid": codeforces, 
        "is_leetcode_invalid": leetcode, 
        "is_github_invalid": github
    };

    console.log(data)


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
            tls: {
                rejectUnAuthorized: false
            }
        });

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: userEmail,
            subject: 'Rcoem Coderz - Someone is reported',
            text: `Heyy admin, a report is registered. ${JSON.stringify(data)}`
        };

        await transporter.sendMail(mailOptions);

        console.log("email sent to admins");
    };

    await sendEmail(process.env.ADMIN_EMAIL_1);
    await sendEmail(process.env.ADMIN_EMAIL_2);

    // console.log('Email sent successfully');

    res.json({
        "success": true,
        "message": `Report registered successfully!!`
    })

});



