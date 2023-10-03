const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const LeaderBoard = require("../models/ranklistModel");
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

                    finalData.leetcode_rating = parseInt(res[2].data.userContestRanking.rating)
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

            await LeaderBoard.deleteMany({})

            const updatedList = await LeaderBoard.create(
                {
                    ...Ranklist
                }
            );

            console.log({
                "success" : true,
                "message": `Leaderboard Updated Successfully!!`,
                "leaderboard": updatedList
            })


        })
        .catch((error) => {
            console.log(error)
        })


})


module.exports = updateRatings;
