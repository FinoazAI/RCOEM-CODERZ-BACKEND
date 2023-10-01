const { resolve } = require("path");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const fetch = require("node-fetch");




let promiseCall = (URL) => {

    return async (resolve, reject) => {
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


const updateRatings = catchAsyncErrors(async () => {

    console.log("Ratings Updation Started....");


    // fetching user ids from Database
    const userdata = await User.find({}, { "password": 0, "_id": 0 });

    // console.log("UserData: ", userdata);



    let Ranklist = []
    let PromiseList = []

    for (let user of userdata) {

        // console.log(user)

        let name = user.name
        let email = user.email
        let cc_id = user.codechef_id
        let cf_id = user.codeforces_id
        let lc_id = user.leetcode_id
        let ghub_id = user.github_id
        let avatar_url = "https://avatars.githubusercontent.com/u/146207981?v=4"
        let cc_score = 0;
        let cf_score = 0;
        let lc_score = 0;



        let finalData = {
            name,
            email,
            total_score: 0,
            codechef_id: cc_id,
            codechef_rating: cc_score,
            codeforces_id: cf_id,
            codeforces_rating: cf_score,
            leetcode_id: lc_id,
            leetcode_rating: lc_score,
            github_id: ghub_id,
            avatar: avatar_url
        }


        let p = new Promise((resolve, reject) => {

            let p1 = new Promise(promiseCall(process.env.CODECHEF_API + cc_id))
            let p2 = new Promise(promiseCall(process.env.CODEFORCES_API + cf_id))
            let p3 = new Promise(promiseCall(process.env.LEETCODE_API + lc_id))

            Promise.all([p1, p2, p3])
                .then(((res) => {
                    // console.log("Response ALL ", res)

                    finalData.codechef_rating = res[0].rating_number + res[0].max_rank
                    finalData.total_score += finalData.codechef_rating

                    finalData.codeforces_rating = res[1][0].rating + res[1][0].maxRating
                    finalData.total_score += finalData.codeforces_rating

                    finalData.leetcode_rating = res[2].data.userContestRanking.rating
                    finalData.total_score += finalData.leetcode_rating

                    resolve(finalData)
                }))
                .catch((error) => {
                    // console.log("Error : ", error)
                    reject(error)
                })

        })

        PromiseList.push(p);
    }


    Promise.all(PromiseList)
        .then((result) => {
            console.log("End Result : ", result)
        })
        .catch((error) => {
            console.log(error)
        })


})




// const updateRatings = catchAsyncErrors(async () => {

//     console.log("Ratings Updation Started....");


//     // fetching user ids from Database
//     const userdata = await User.find({}, { "password": 0, "_id": 0 });

//     // console.log("UserData: ", userdata);



//     let Ranklist = []
//     // let CodechefRanklist = []
//     // let Codeforceslist = []
//     // let Leetcodelist = []

//     for (let user of userdata) {

//         // console.log(user)

//         let name = user.name
//         let email = user.email
//         let cc_id = user.codechef_id
//         let cf_id = user.codeforces_id
//         let lc_id = user.leetcode_id
//         let ghub_id = user.github_id
//         let avatar_url = "https://avatars.githubusercontent.com/u/146207981?v=4"
//         let cc_score = 0;
//         let cf_score = 0;
//         let lc_score = 0;



//         let finalData = {
//             name, 
//             email, 
//             total_score: 0, 
//             codechef_id : cc_id, 
//             codechef_rating : cc_score, 
//             codeforces_id : cf_id, 
//             codeforces_rating: cf_score, 
//             leetcode_id : lc_id, 
//             leetcode_rating : lc_score, 
//             github_id : ghub_id, 
//             avatar: avatar_url
//         }

//         // fetching codechef ratings
//         if (cc_id) {

//             async function getData(){
//                 const CODECHEF_API = process.env.CODECHEF_API + cc_id
//                 const response = await fetch(CODECHEF_API);
//                 const jsonResponse = await response.json();
//                 finalData.codechef_rating =  jsonResponse.rating_number + jsonResponse.max_rank
//                 finalData.total_score += finalData.codechef_rating
//                 // console.log("Codechef : ", cc_id, cc_score)
//             }

//             getData()
//         }



//         // fetching codeforces ratings
//         if (cf_id) {

//             async function getData(){
//                 const CODEFORCES_API = process.env.CODEFORCES_API + cf_id
//                 const response = await fetch(CODEFORCES_API);
//                 const jsonResponse = await response.json();
//                 finalData.codeforces_rating = jsonResponse[0].rating + jsonResponse[0].maxRating
//                 finalData.total_score += finalData.codeforces_rating
//                 // console.log("Codeforces : ", cf_id, cf_score)
//             }

//             getData()
//         }




//         // fetching leetcode ratings
//         if (lc_id) {

//             async function getData(){
//                 const LEETCODE_API = process.env.LEETCODE_API + lc_id
//                 const response = await fetch(LEETCODE_API);
//                 const jsonResponse = await response.json();
// finalData.leetcode_rating = jsonResponse.data.userContestRanking.rating
// finalData.total_score += finalData.leetcode_rating
//                 // console.log("Leetcode : ", lc_id, lc_score)
//             }

//             getData()
//         }



//         // fetching github avatar
//         if (ghub_id) {

//             async function getData(){
//                 const GITHUB_API = process.env.GITHUB_API + ghub_id
//                 const response = await fetch(GITHUB_API);
//                 const jsonResponse = await response.json();
//                 finalData.avatar = jsonResponse.avatar_url
//                 console.log("Github : ", ghub_id, jsonResponse)
//             }

//             getData()
//         }        

//         setTimeout(()=>{
//             console.log(finalData)
//             Ranklist.push(finalData)
//         }, 5000)
//     }

//     setTimeout(()=>{
//         console.log("Ranklist : ", Ranklist)
//     }, 10000)

// })








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
