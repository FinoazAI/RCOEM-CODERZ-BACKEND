const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter Your Name"],
            maxLength: [30, "Name cannot exceed 30 characters"],
            minLength: [4, "Name should have more than 4 characters"],
        },
        email: {
            type: String,
            required: [true, "Please Enter Your Email"],
            unique: true,
            validate: [validator.isEmail, "Please Enter a valid Email"],
        },
        password: {
            type: String,
            required: [true, "Please Enter Your Password"],
            select: false,
        },
        emailVerificationOTP: {
            type: String
        },
        emailVerificationOTPExpiry: {
            type: Date
        },
        forgotPasswordOTP: {
            type: String
        },
        forgotPasswordOTPExpiry: {
            type: Date
        },
        codechef_id: {
            type: String,
        },
        codeforces_id: {
            type: String,
        },
        leetcode_id: {
            type: String,
        },
        github_id: {
            type: String,
        },
        codechef_rating: {
            type: Number,
            default: 0
        },
        codeforces_rating: {
            type: Number,
            default: 0
        },
        leetcode_rating: {
            type: Number,
            default: 0
        },
        total_score: {
            type: Number,
            default: 0
        },
        avatar: {
            type: String,
            default: "https://avatars.githubusercontent.com/u/146207981?v=4"
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);


// Generating OTP
userSchema.methods.generateOTP = function () {

    var digits = '0123456789'; 
    var OTP_len = 4

    let otp = ''; 
    for (let i = 0; i < OTP_len; i++ ) { 
        otp += digits[Math.floor(Math.random() * 10)]; 
    } 

    console.log("generated otp is: ", otp)

    this.emailVerificationOTP = otp
    this.emailVerificationOTPExpiry = Date.now() + (60 * 60 * 1000);

    console.log("set otp is: ", this.emailVerificationOTP)

    return;
};


userSchema.methods.verifyOTP = async function (input) {

    if (!this.emailVerificationOTPExpiry || !this.emailVerificationOTP) {
        return false;
    }

    if (Date.now() > this.emailVerificationOTPExpiry) {
        return false;
    }

    console.log("verify otp data: ", input, this.emailVerificationOTP);

    return (this.emailVerificationOTP == input);
};


module.exports = mongoose.model("User", userSchema);