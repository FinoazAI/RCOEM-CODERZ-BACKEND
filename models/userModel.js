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
        },
        codeforces_rating: {
            type: Number,
        },
        leetcode_rating: {
            type: Number,
        },
        total_score: {
            type: Number,
        },
        avatar: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
);



module.exports = mongoose.model("User", userSchema);