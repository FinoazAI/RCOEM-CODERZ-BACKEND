const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const LeaderBoard = require("../models/ranklistModel");
const OtpModel = require("../models/otpModel");
const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
const otpModel = require("../models/otpModel");
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
            tls: {
                rejectUnAuthorized: false
            }
        });

        // console.log("transported created");

        let user = await otpModel.findOne({ "email": userEmail });

        if (!user) {

            await otpModel.create({
                email: userEmail
            });

            user = await otpModel.findOne({ "email": userEmail });
        }
        
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

    const user = await otpModel.findOne({ "email": email });

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



