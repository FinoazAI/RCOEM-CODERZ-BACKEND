const updateRatings = () => {

    console.log("Ratings Updation Started....");

    let updateCount = 0;

    let dummy = {
        "Pratham": {
            "codechef": 1800,
            "codeforces": 1500,
            "leetcode": 2000
        },
        "Kush":{
            "codechef": 2000,
            "leetcode": 1900
        }
    };

    setInterval(() => {

        updateCount++;
        console.log("updateCount : ", updateCount);

        for(let user in dummy){

            // console.log("user: ", user)
            // console.log(dummy[user])

            for(let platform in dummy[user]){

                // console.log("platform: ", platform)

                dummy[user][platform] += 10;
            }
        }

        console.log("DB : ", dummy);


        if(updateCount == 5)
        {
            dummy["Bhushan"] = {
                "codechef": 1800,
                "codeforces": 1500,
                "leetcode": 2000
            }
        }

        if(updateCount == 10)
        {
            dummy["Anjali"] = {
                "codechef": 1000,
                "codeforces": 1000,
            }
        }

    }, 3000);


}

module.exports = updateRatings;
