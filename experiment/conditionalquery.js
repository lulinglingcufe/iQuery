const nano = require('nano')('http://10.214.242.226:5990');
const async = require('async')
//const { MerkleTree } = require('merkletreejs')
//const SHA256 = require('crypto-js/sha256')
const newdb = require('nano')('http://10.214.242.226:5990/testmerkletree');

const queryarg = 530;
const queryargString = queryarg  + '';
const q1interval = (queryarg - 10) + '';
const q2intervalup = queryarg + 1;
const queryargdown = queryarg - 10;

const myData = [];

const searchdb = nano.use('mychannel_edu_test3consumeservicetx');
const db = nano.use('mychannel_edu_historywithvalue');
const searchdb2 = nano.use('mychannel_edu_test1historywithvalue');

const  q =  {
    selector: {
        timestamp: {
            "$gt": "2020-05-04T11:26:27.016Z",
            "$lt": "2020-05-04T11:26:27.085Z"
        }
    },
    limit:100
}

const  q2 =  {
    selector: {
        blocknumber: {
            "$gt": 52,
            "$lt": 54
        }
    },
    limit:100
}


const  q3 = {
    selector: {
    "$and": [
        {
            blocknumber: {
                "$gt": 52,
                "$lt": 100
            }
        },
        {
            value: {
                "$and": [
                    {
                        docType: {
                            "$eq": "service"
                        }
                    },
                    {
                        owner: {
                            "$eq": "User_21@A.com"
                        }
                    }
                ]
            }
        }
    ]
}
}



const  q4 =   {
    selector: {
        "$and": [
            {
                blocknumber: {
                    "$gt": 52,
                    "$lt": 100
                }
            },
            {
                value: {
                    "$or": [
                        { owner: "User_21@A.com" },
                        { owner: "User_22@A.com" }
                    ]
                }
            }
        ]
    }
}

// console.time('ProcessBlock time');
// searchdb.find(q).then((doc) => {
//     console.log(doc);
// });
// console.timeEnd('ProcessBlock time');
async function asyncCall() {
    //one
    var beginTime = +new Date();
    for(var i=0; i<10; i++){
        //console.time('ProcessBlock time');
        var response = await searchdb2.find(q);
        //console.timeEnd('ProcessBlock time');
    }
    var endTime = +new Date();
    var costtime = endTime-beginTime
    console.log("q1:")
    console.log(costtime/10.0)

   //two
    var beginTime2 = +new Date();
    for(var i=0; i<10; i++){
        //console.time('ProcessBlock time');
        var response = await searchdb2.find(q2);
        //console.timeEnd('ProcessBlock time');
    }
    var endTime2 = +new Date();
    var costtime2 = endTime2-beginTime2
    console.log("q2:")
    console.log(costtime2/10.0)

    //three
    var beginTime3 = +new Date();
    for(var i=0; i<10; i++){
        //console.time('ProcessBlock time');
        var response = await searchdb2.find(q3);
        //console.timeEnd('ProcessBlock time');
    }
    var endTime3 = +new Date();
    var costtime3 = endTime3-beginTime3;
    console.log("q3:")
    console.log(costtime3/10.0)

    //four
    var beginTime4 = +new Date();
    for(var i=0; i<10; i++){
        //console.time('ProcessBlock time');
        var response = await searchdb2.find(q4);
        //console.timeEnd('ProcessBlock time');
    }
    var endTime4 = +new Date();
    var costtime4 = endTime4-beginTime4;
    console.log("q4:")
    console.log(costtime4/10.0)

    return response
}
asyncCall()

// async function asyncCall2() {
//     var beginTime = +new Date();
//     for(var i=0; i<10; i++){
//         console.time('ProcessBlock time');
//         var response = await searchdb2.find(q2);
//         console.timeEnd('ProcessBlock time');
//     }
//     var endTime = +new Date();
//     var costtime = endTime-beginTime
//     console.log("q2:")
//     console.log(costtime/10.0)
//     //console.log(response)
//     return response
// }
// asyncCall2()
//
// async function asyncCall3() {
//     var beginTime = +new Date();
//     for(var i=0; i<10; i++){
//         console.time('ProcessBlock time');
//         var response = await searchdb2.find(q3);
//         console.timeEnd('ProcessBlock time');
//     }
//     var endTime = +new Date();
//     var costtime = endTime-beginTime;
//     console.log("q3:")
//     console.log(costtime/10.0)
//     //console.log(response)
//     return response
// }
// asyncCall3()
//
// async function asyncCall4() {
//     var beginTime = +new Date();
//     for(var i=0; i<10; i++){
//         console.time('ProcessBlock time');
//         var response = await searchdb2.find(q4);
//         console.timeEnd('ProcessBlock time');
//     }
//     var endTime = +new Date();
//     var costtime = endTime-beginTime;
//     console.log("q4:")
//     console.log(costtime/10.0)
//     //console.log(response)
//     return response
// }
// asyncCall4()
