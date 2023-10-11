const mongoose = require("mongoose");
const validator = require("validator");

const ranklistSchema = new mongoose.Schema(
    {
        total_score_list: [
            {
                name: { type: String },
                email: { type: String },
                total_score: { type: Number },
                codechef_id: { type: String },
                codechef_rating: { type: Number },
                codeforces_id: { type: String },
                codeforces_rating: { type: Number },
                leetcode_id: { type: String },
                leetcode_rating: { type: Number },
                github_id: { type: String },
                avatar: { type: String },
                college_name: { type: String },
            },
        ],
        codechef_ranklist: [
            {
                name: { type: String },
                email: { type: String },
                total_score: { type: Number },
                codechef_id: { type: String },
                codechef_rating: { type: Number },
                codeforces_id: { type: String },
                codeforces_rating: { type: Number },
                leetcode_id: { type: String },
                leetcode_rating: { type: Number },
                github_id: { type: String },
                avatar: { type: String },
                college_name: { type: String },
            },
        ],
        codeforces_ranklist: [
            {
                name: { type: String },
                email: { type: String },
                total_score: { type: Number },
                codechef_id: { type: String },
                codechef_rating: { type: Number },
                codeforces_id: { type: String },
                codeforces_rating: { type: Number },
                leetcode_id: { type: String },
                leetcode_rating: { type: Number },
                github_id: { type: String },
                avatar: { type: String },
                college_name: { type: String },
            },
        ],
        leetcode_ranklist: [
            {
                name: { type: String },
                email: { type: String },
                total_score: { type: Number },
                codechef_id: { type: String },
                codechef_rating: { type: Number },
                codeforces_id: { type: String },
                codeforces_rating: { type: Number },
                leetcode_id: { type: String },
                leetcode_rating: { type: Number },
                github_id: { type: String },
                avatar: { type: String },
                college_name: { type: String },
            },
        ],
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }
);



module.exports = mongoose.model("LeaderBoard", ranklistSchema);