const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");


//////////// ERROR ///////////





// const fetchUserData = catchAsyncErrors(async () => {

//     // let data = await User.find({}, { "password": 0, "_id": 0 });

//     let data = await User.find();

//     console.log(1)

//     console.log("data : ", data);

//     console.log(2)

//     return data;
// })





// const updateRatings = catchAsyncErrors(async () => {

//     console.log("Ratings Updation Started....");

//     let userdata = await fetchUserData();

//     console.log("UserData: ", userdata);

// })




const fetchUserData = async () => {
    try {
        console.log("Fetching User Data...");
        const data = await User.find({}, { password: 0, _id: 0 });
        console.log("Fetched Data:", data);
        return data;
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error fetching user data:", error);
        throw error; // Rethrow the error to be caught by the calling function
    }
};

const updateRatings = async () => {
    try {
        console.log("Ratings Updation Started...");
        let userdata = await fetchUserData();
        console.log("UserData:", userdata);
    } catch (error) {
        // Handle any errors that occur during the rating update
        console.error("Error updating ratings:", error);
        // You can choose to handle the error here or rethrow it if needed
        throw error;
    }
};

// Call updateRatings to start the process
// updateRatings();





module.exports = updateRatings;












// let updateCount = 0;

// let dummy = {
//     "Pratham": {
//         "codechef": 1800,
//         "codeforces": 1500,
//         "leetcode": 2000
//     },
//     "Kush":{
//         "codechef": 2000,
//         "leetcode": 1900
//     }
// };

// setInterval(() => {

//     updateCount++;
//     console.log("updateCount : ", updateCount);

//     for(let user in dummy){

//         // console.log("user: ", user)
//         // console.log(dummy[user])

//         for(let platform in dummy[user]){

//             // console.log("platform: ", platform)

//             dummy[user][platform] += 10;
//         }
//     }

//     console.log("DB : ", dummy);


//     if(updateCount == 5)
//     {
//         dummy["Bhushan"] = {
//             "codechef": 1800,
//             "codeforces": 1500,
//             "leetcode": 2000
//         }
//     }

//     if(updateCount == 10)
//     {
//         dummy["Anjali"] = {
//             "codechef": 1000,
//             "codeforces": 1000,
//         }
//     }

// }, 3000);
