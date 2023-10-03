const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const LeaderBoard = require("../models/ranklistModel");



// Get Latest Codechef Leaderboard
exports.get_codechef_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const codechef = leaderboard.codechef_ranklist

    res.json({
        "success" : true,
        "data": codechef
    })

});

// Get Latest Codeforces Leaderboard
exports.get_codeforces_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const codeforces = leaderboard.codeforces_ranklist

    res.json({
        "success" : true,
        "data": codeforces
    })

});

// Get Latest Leetcode Leaderboard
exports.get_leetcode_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const leetcode = leaderboard.leetcode_ranklist

    res.json({
        "success" : true,
        "data": leetcode
    })

});

// Get Latest TotalScore Leaderboard
exports.get_totalScore_leaderboard = catchAsyncErrors(async (req, res, next) => {

    const leaderboard = await LeaderBoard.findOne({}, {_id:0, __v:0});
    const totalScore = leaderboard.total_score_list

    res.json({
        "success" : true,
        "data": totalScore
    })

});
