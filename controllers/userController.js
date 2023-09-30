const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password, codechef_id, codeforces_id, leetcode_id, github_id } = req.body;


    console.log(name, email, password, codechef_id, codeforces_id, leetcode_id, github_id);

    if (!name || !email || !password) {
        return next(new ErrorHander("All fields are compulsory!!!", 400));
    }

    if(!codechef_id && !leetcode_id && !codeforces_id && !github_id){
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
        "success" : true,
        "message": `User (${user.email}) Registered Successfully!!`
    })

});
