const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const LeaderBoard = require("../models/ranklistModel");
const fetch = require("node-fetch");
const { default: mongoose } = require("mongoose");



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




// Updates User ratings & set leaderboard with lastest data
const updateRatings = catchAsyncErrors(async () => {

    console.log("Ratings Updation Started....");


    // fetching user ids from Database
    const userdata = await User.find({}, { "password": 0, "_id": 0 });

    // console.log("UserData: ", userdata);



    let PromiseList = []

    for (let user of userdata) {

        // console.log(user)

        let name = user.name
        let email = user.email
        let cc_id = user.codechef_id
        let cf_id = user.codeforces_id
        let lc_id = user.leetcode_id
        let college_name = user.college_name
        let ghub_id = user.github_id
        let avatar_url = "https://avatars.githubusercontent.com/u/146207981?v=4"
        let cc_score = 0;
        let cf_score = 0;
        let lc_score = 0;



        let finalData = {
            name,
            email,
            total_score: 0,
            college_name: college_name,
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
            // let p4 = new Promise(promiseCall(process.env.GITHUB_API1 + ghub_id))


            Promise.all([p1, p2, p3/* , p4 */])
                .then(((res) => {
                    // console.log("Response ALL ", res)

                    if (res[0] && res[0].rating_number && res[0].max_rank) {
                        finalData.codechef_rating = res[0].rating_number + res[0].max_rank
                        finalData.total_score += (finalData.codechef_rating * 1.5)
                        //finalData.college_name += res[0].institution
                    }

                    
                    if (res[1] && res[1][0] && res[1][0].rating && res[1][0].maxRating) {
                        finalData.codeforces_rating = res[1][0].rating + res[1][0].maxRating /*+  (2 * (res[1][1].ratings.length && res[1][1].ratings.length >= 1) ? (res[1][1].ratings.length) : 0) */
                        finalData.total_score += (finalData.codeforces_rating * 1.5)
                    }

                    if (res[2] && res[2].data && res[2].data.userContestRanking && res[2].data.userContestRanking.rating) {
                        finalData.leetcode_rating = parseInt(res[2].data.userContestRanking.rating) /* + 3 * parseInt(res[2].data.userContestRanking.attendedContestsCount) */
                        finalData.total_score += (finalData.leetcode_rating * 1.5)
                    }



                    // let gitScore = 0

                    // for (const key in res[3].total) {
                    //     if (res[3] && res[3].total && res[3].total.hasOwnProperty(key)) {
                    //         gitScore += parseInt((res[3].total[key]) / 30);
                    //     }
                    // }

                    // // console.log(name, gitScore)

                    // finalData.total_score += gitScore

                    finalData.total_score = parseInt(finalData.total_score)

                    resolve(finalData)
                }))
                .catch((error) => {
                    // console.log("Error : ", error)
                    reject(error)
                })

        })

        PromiseList.push(p);

        // break;
    }




    Promise.all(PromiseList)
        .then(async (result) => {

            // console.log("End Result : ", result)

            let Ranklist = {
                "total_score_list": [...result],
                "codechef_ranklist": [...result],
                "codeforces_ranklist": [...result],
                "leetcode_ranklist": [...result]
            }

            Ranklist.total_score_list.sort(
                (x, y) => { return y.total_score - x.total_score }
            )

            Ranklist.codechef_ranklist.sort(
                (x, y) => { return y.codechef_rating - x.codechef_rating }
            )

            Ranklist.codeforces_ranklist.sort(
                (x, y) => { return y.codeforces_rating - x.codeforces_rating }
            )

            Ranklist.leetcode_ranklist.sort(
                (x, y) => { return y.leetcode_rating - x.leetcode_rating }
            )


            // console.log("Ranklist.total_score_list : ", Ranklist.total_score_list)
            // console.log("Ranklist : ", Ranklist)

            let x = mongoose.connection.collections.leaderboards
            // console.log(x)

            if (x) {
                await LeaderBoard.deleteMany({})
            }

            const updatedList = await LeaderBoard.create(
                {
                    ...Ranklist
                }
            );

            console.log({
                "success": true,
                "message": `Leaderboard Updated Successfully!!`,
                "leaderboard": updatedList
            })


        })
        .catch((error) => {
            console.log(error)
        })


})


module.exports = updateRatings;
