const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ContestDB = require("../models/contestModel");
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




// copy user database content -- data loss issue
exports.get_all_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.all_contests
    const updatedAt = data.updatedAt

    res.json({
        "success" : true,
        "data": list,
        updatedAt 
    })

});


// copy user database content -- data loss issue
exports.get_codechef_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.codechef_contests
    const updatedAt = data.updatedAt

    res.json({
        "success" : true,
        "data": list,
        updatedAt 
    })

});


// copy user database content -- data loss issue
exports.get_codeforces_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.codeforces_contests
    const updatedAt = data.updatedAt

    res.json({
        "success" : true,
        "data": list,
        updatedAt 
    })

});


// copy user database content -- data loss issue
exports.get_leetcode_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.leetcode_contests
    const updatedAt = data.updatedAt

    res.json({
        "success" : true,
        "data": list,
        updatedAt 
    })

});


// copy user database content -- data loss issue
exports.get_geeksforgeeks_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.geeksforgeeks_contests
    const updatedAt = data.updatedAt

    res.json({
        "success" : true,
        "data": list,
        updatedAt 
    })

});


// copy user database content -- data loss issue
exports.get_hackerrank_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.hackerrank_contests
    const updatedAt = data.updatedAt

    res.json({
        "success" : true,
        "data": list,
        updatedAt 
    })

});


// copy user database content -- data loss issue
exports.get_hackerearth_contests = catchAsyncErrors(async (req, res, next) => {

    const data = await ContestDB.findOne({});
    const list = data.hackerrank_contests
    const updatedAt = data.updatedAt

    res.json({
        "success" : true,
        "data": list,
        updatedAt 
    })

});



// copy user database content -- data loss issue
exports.cron_update_contest = catchAsyncErrors(async (req, res, next) => {

    console.log("contests Updation Started....");


    let contest_cc = process.env.contest_cc;
    let contest_cf = process.env.contest_cf;
    let contest_lc = process.env.contest_lc;
    let contest_gfg = process.env.contest_gfg;
    let contest_hr = process.env.contest_hr;
    let contest_he = process.env.contest_he;

    let date = new Date()
    date = date.toISOString().split('T')[0]

    const tailURL = date + "T00%3A00%3A00"

    contest_cc += tailURL
    contest_cf += tailURL
    contest_lc += tailURL
    contest_gfg += tailURL
    contest_hr += tailURL
    contest_he += tailURL

    console.log(contest_cc);
    console.log(contest_cf);
    console.log(contest_lc);
    console.log(contest_gfg);
    console.log(contest_hr);
    console.log(contest_he);

    const p1 = new Promise(promiseCall(contest_cc));
    const p2 = new Promise(promiseCall(contest_cf));
    const p3 = new Promise(promiseCall(contest_lc));
    const p4 = new Promise(promiseCall(contest_gfg));
    const p5 = new Promise(promiseCall(contest_hr));
    const p6 = new Promise(promiseCall(contest_he));


    // const p1 = new Promise((resolve, reject) => { resolve() });
    // const p2 = new Promise((resolve, reject) => { resolve() });
    // const p3 = new Promise((resolve, reject) => { resolve() });
    // const p4 = new Promise((resolve, reject) => { resolve() });
    // const p5 = new Promise((resolve, reject) => { resolve() });
    // const p6 = new Promise((resolve, reject) => { resolve() });

    Promise.allSettled([p1, p2, p3, p4, p5, p6])
        .then(async (result) => {

            // console.log(result)

            finaldata = []
            ccdata = []
            cfdata = []
            lcdata = []
            gfgdata = []
            hrdata = []
            hedata = []



            // codechef contests
            if(
                result[0] &&
                result[0].status === "fulfilled" &&
                result[0].value &&
                result[0].value.objects && 
                result[0].value.objects[0]
            ){
                finaldata.push(...result[0].value.objects)
                ccdata.push(...result[0].value.objects)
            }

            

            // codeforces contests
            if(
                result[1] &&
                result[1].status === "fulfilled" &&
                result[1].value &&
                result[1].value.objects && 
                result[1].value.objects[0]
            ){
                finaldata.push(...result[1].value.objects)
                cfdata.push(...result[1].value.objects)
            }
            

            // leetcode contests
            if(
                result[2] &&
                result[2].status === "fulfilled" &&
                result[2].value &&
                result[2].value.objects && 
                result[2].value.objects[0]
            ){
                finaldata.push(...result[2].value.objects)
                lcdata.push(...result[2].value.objects)
            }
            

            // gfg contests
            if(
                result[3] &&
                result[3].status === "fulfilled" &&
                result[3].value &&
                result[3].value.objects && 
                result[3].value.objects[0]
            ){
                finaldata.push(...result[3].value.objects)
                gfgdata.push(...result[3].value.objects)
            }

            // hackerrank contests
            if(
                result[4] &&
                result[4].status === "fulfilled" &&
                result[4].value &&
                result[4].value.objects && 
                result[4].value.objects[0]
            ){
                finaldata.push(...result[4].value.objects)
                hrdata.push(...result[4].value.objects)
            }
            

            // hackerearth contests
            if(
                result[5] &&
                result[5].status === "fulfilled" &&
                result[5].value &&
                result[5].value.objects && 
                result[5].value.objects[0]
            ){
                finaldata.push(...result[5].value.objects)
                hedata.push(...result[5].value.objects)
            }




            finaldata.sort((a, b)=>{
                let date1 = new Date(a.start);
                let date2 = new Date(b.start);
                return date1-date2;
            })



            dbdata = {
                "all_contests": finaldata,
                "codechef_contests": ccdata,
                "codeforces_contests": cfdata,
                "leetcode_contests": lcdata,
                "geeksforgeeks_contests": gfgdata,
                "hackerrank_contests": hrdata,
                "hackerearth_contests": hedata,
            }


            let x = mongoose.connection.collections.contestdb
            // console.log(x)

            if (x) {
                await LeaderBoard.deleteMany({})
            }

            const updatedList = await ContestDB.create(
                {
                    ...dbdata
                }
            );


            return res.json({
                "success": true,
                "message": `Contests fetched sucessfully @${Date(Date.now()).toString()}`,
                "data": updatedList
            })

        })
        .catch((err) => {

            console.log("error: ", err);
            
            return res.json({
                "success": false,
                "error": err,
                "message": "error occoured while fetching contests"
            });
        })


    // return res.json({
    //     "success": false,
    //     "message": `Out of promise.all @${Date(Date.now()).toString()}`,
    // })

});
