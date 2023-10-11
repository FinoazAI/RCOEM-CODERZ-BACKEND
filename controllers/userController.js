const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const LeaderBoard = require("../models/ranklistModel");
const OtpModel = require("../models/otpModel");
const nodeMailer = require("nodemailer");
const fetch = require("node-fetch");



// General function to Fetch data from {CC, CF, LC} Apis 
let promiseCall = (URL) => {

    return (resolve, reject) => {
        fetch(URL)
            .then((response) => {
                return response.json()
            })
            .then((jsonResponse) => {
                // console.log(URL, jsonResponse)
                resolve(jsonResponse);
            })
            .catch((error) => {
                reject(error)
            })
    }

}


/* const emailDomainCheck = (input) => {

    // input = JSON.stringify(input)

    var parts = input.split("@");

    if (parts.length === 2) {
        if (parts[1] === "rknec.edu") {
            return true;
        }
    }
    return false;
} */


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    // { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } 

    const { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id, college_name } = req.body;

    console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id, college_name);

    if (!name || !email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    /* if (!emailDomainCheck(email)) {
        return next(new ErrorHander("Please enter your valid RKNEC domain email id", 400));
    } */

    if (!codechef_id && !leetcode_id && !codeforces_id && !github_id) {
        return next(new ErrorHander("Enter atleast one platform details", 400));
    }


    let p1 = new Promise(promiseCall(process.env.CODECHEF_API + codechef_id))
    let p2 = new Promise(promiseCall(process.env.CODEFORCES_API + codeforces_id))
    let p3 = new Promise(promiseCall(process.env.LEETCODE_API + leetcode_id))
    let p4 = new Promise(promiseCall(process.env.GITHUB_API1 + github_id))

    Promise.all([p1, p2, p3, p4])
        .then(async () => {

            const user = await User.create({
                name,
                email,
                password,
                codechef_id,
                codeforces_id,
                leetcode_id,
                github_id,
                college_name,
            });


            res.json({
                "success": true,
                "message": `User (${user.email}) Registered Successfully!!`
            })

        })
        .catch((err) => {
            return next(new ErrorHander("Invalid username found, please enter valid usernames", 400));
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

    if (user && user.password == password) {

        res.json({
            "success": true,
            "isvalid": true,
            "name": user.name,
            "password": user.password,
            "github_id": user.github_id,
            "codechef_id": user.codechef_id,
            "codeforces_id": user.codeforces_id,
            "leetcode_id": user.leetcode_id,
            "college_name": user.college_name,
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


    /* if (!emailDomainCheck(email)) {
        return next(new ErrorHander("Please enter your valid RKNEC domain email id", 400));
    } */

    const regUser = await User.findOne({ "email": email });

    if (regUser) {
        return next(new ErrorHander("User already registered!!", 400));
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
            text: `Heyy coder, your One Time Password (OTP) for email verification is ${OTP}. Thank You!!!`,
            html: `
            
            Thank you for choosing RCOEM Coderz for your coding needs! 
            <br>
            To ensure the security of your account, we require a one-time password (OTP) verification.

            <br><br>
            <b>Please find your OTP below:</b>
            <br><br>
            <b>OTP: ${OTP}</b>

            <br><br>
            
            Kindly enter <b>this OTP on the Login Page</b> to access your RCOEM Coderz account. 
            <br>
            <b>Please note that this OTP is valid for a limited time and should not be shared with anyone.</b>
            
            <br>

            <p style="color: red; font-weight:700">If you did not request this OTP or have any concerns, please contact our support team immediately. <a href="https://www.linkedin.com/in/kush-munot/">Kush</a> and  <a href="https://www.linkedin.com/in/prathamesh-rajbhoj-2bb157200/">Pratham</a></p>
            
            <br>

            Thank you for trusting RCOEM Coderz for your coding journey.
            <br><br>
            Best regards,<br/>
            The RCOEM Coderz Team
            `
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




// verify OTP sent to email id of registered User
exports.sendUpdateProfileOTP = catchAsyncErrors(async (req, res, next) => {

    const { email } = req.body;

    console.log("email recieved for OTP: ", email);

    if (!email) {
        return next(new ErrorHander("Email not found, please try again", 400));
    }


    const regUser = await User.findOne({ "email": email });

    if (!regUser) {
        return next(new ErrorHander("This email is not registered!!", 400));
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
            text: `Heyy coder, your One Time Password (OTP) for user verification is ${OTP}. Thank You!!!`,
            html: `
            
            Thank you for choosing RCOEM Coderz for your coding needs! 
            <br>
            To ensure the security of your account, we require a one-time password (OTP) verification.

            <br><br>
            <b>Please find your OTP below:</b>
            <br><br>
            <b>OTP: ${OTP}</b>

            <br><br>
            
            Kindly enter <b>this OTP on the Edit Profile Page</b> to edit your RCOEM Coderz account details. 
            <br>
            <b>Please note that this OTP is valid for a limited time and should not be shared with anyone.</b>
            
            <br>

            <p style="color: red; font-weight:700">If you did not request this OTP or have any concerns, please contact our support team immediately. <a href="https://www.linkedin.com/in/kush-munot/">Kush</a> and  <a href="https://www.linkedin.com/in/prathamesh-rajbhoj-2bb157200/">Pratham</a></p>
            
            <br>

            Thank you for trusting RCOEM Coderz for your coding journey.
            <br><br>
            Best regards,<br/>
            The RCOEM Coderz Team
            `
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





// get profile data for profile page
exports.verifyUpdateProfileOTP = catchAsyncErrors(async (req, res, next) => {

    const { email, otp } = req.body;

    // console.log("data recieved: ", email, otp);

    if (!email || !otp) {
        return next(new ErrorHander("Sufficient data not found", 400));
    }

    const user = await OtpModel.findOne({ "email": email });

    if (!user) {
        return next(new ErrorHander("No user/OTP found", 400));
    }

    // console.log("user: ", user)

    let isValid = await user.verifyOTP(otp);

    // await user.save({ validateBeforeSave: false });

    // console.log("isvalid: ", isValid)

    if (isValid) {


        let userdata = await User.findOne({ "email": email });

        if (!userdata) {
            return next(new ErrorHander("User not found, please register", 400));
        }

        res.json({
            "success": true,
            "isvalid": true,
            "name": userdata.name,
            "password": userdata.password,
            "github_id": userdata.github_id,
            "codechef_id": userdata.codechef_id,
            "codeforces_id": userdata.codeforces_id,
            "leetcode_id": userdata.leetcode_id,
            "message": `User Verified successfully `
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
        "message": `User validation failed`
    })

});




// update profile data for profile page
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const { email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;


    console.log(email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!email || !password || !codechef_id || !leetcode_id || !codeforces_id || !github_id) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }


    let p1 = new Promise(promiseCall(process.env.CODECHEF_API + codechef_id))
    let p2 = new Promise(promiseCall(process.env.CODEFORCES_API + codeforces_id))
    let p3 = new Promise(promiseCall(process.env.LEETCODE_API + leetcode_id))
    let p4 = new Promise(promiseCall(process.env.GITHUB_API1 + github_id))

    Promise.all([p1, p2, p3, p4])
        .then(async () => {

            const user = await User.findOneAndUpdate({ "email": email }, {
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

        })
        .catch((err) => {
            return next(new ErrorHander("Invalid username found, please enter valid usernames", 400));
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



