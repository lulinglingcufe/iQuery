/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

'use strict';

const fs = require('fs');
const path = require('path');

const couchdbutil = require('./couchdbutil.js');

const configPath = path.resolve(__dirname, 'nextblocknew3.txt');
//????????
//const nano2 = require('nano')('http://10.214.242.226:5990');
//const searchdb = nano2.use('mychannel_edu_historywithvalue');

exports.processBlockEvent = async function (channelname, block, use_couchdb, nano) {

    return new Promise((async (resolve, reject) => {
        //console.time('processBlockEvent time');


        // reject the block if the block number is not defined
        if (block.header.number == undefined) {
            reject(new Error('Undefined block number'));
        }

        const blockNumber = block.header.number

        //console.log(`------------------------------------------------`);
        //console.log(`Block Number: ${blockNumber}`);

        // reject if the data is not set
        if (block.data.data == undefined) {
            reject(new Error('Data block is not defined'));
        }

        const dataArray = block.data.data;

        // transaction filter for each transaction in dataArray
        const txSuccess = block.metadata.metadata[2];
        txSuccess.forEach(v => console.log("value: %v",v));


        for (var dataItem in dataArray) {
            //onsole.log("dataItem%d",dataItem);
            //console.log("txSuccess[dataItem]：%d",txSuccess[dataItem]); 
            // reject if a timestamp is not set
            if (dataArray[dataItem].payload.header.channel_header.timestamp == undefined) {
                reject(new Error('Transaction timestamp is not defined'));
            }

            // tx may be rejected at commit stage by peers
            // only valid transactions (code=0) update the word state and off-chain db
            // filter through valid tx, refer below for list of error codes
            // https://github.com/hyperledger/fabric-sdk-node/blob/release-1.4/fabric-client/lib/protos/peer/transaction.proto
            if (txSuccess[dataItem] !== 0) {
              //continue();
              const code = txSuccess[dataItem];
              const transactionnum = dataItem;
              const timestamp = dataArray[dataItem].payload.header.channel_header.timestamp;
              // continue to next tx if no actions are set
              if (dataArray[dataItem].payload.data.actions == undefined) {
                  //continue();
              }
              //交易id
              const transactionID = dataArray[dataItem].payload.header.channel_header.tx_id;
  
              // actions are stored as an array. In Fabric 1.4.3 only one
              // action exists per tx so we may simply use actions[0]
              // in case Fabric adds support for multiple actions
              // a for loop is used for demonstration
              const actions = dataArray[dataItem].payload.data.actions;
              // iterate through all actions
              for (var actionItem in actions) {
  
                  // reject if a chaincode id is not defined
                  if (actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name == undefined) {
                      reject(new Error('Chaincode name is not defined'));
                  }
  
                  const chaincodeID = actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name
  
                  //合约参数{byte[][]}
                  var myargs = []; 
                  const args = actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.input.args;
                  for(var arg in args){
                      myargs.push(Buffer.from(args[arg], 'base64').toString('utf8')) ;
                      //console.log("args: " + Buffer.from(args[arg], 'base64').toString('utf8'));
                  }
                  var  isconsumecommodityTx = false;
                  if(myargs[0] == 'consumecommodity'){
                      isconsumecommodityTx = true;
                  }
                  //console.log("isconsumecommodityTx: " + isconsumecommodityTx);
  
                  // reject if there is no readwrite set
                  if (actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset == undefined) {
                      reject(new Error('No readwrite set is defined'));
                  }
  
                  const rwSet = actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset
  
                  for (var record in rwSet) {
  
                      // ignore lscc events 
                      if (rwSet[record].namespace != 'lscc' && isconsumecommodityTx) {
                          // create object to store properties
                          const writeObject = new Object();
                          writeObject.code = code;
                          writeObject.myargs = myargs;
                          writeObject.transactionType = myargs[0];
                          writeObject.commodityID = myargs[1];
                          writeObject.consumerID = myargs[2];
  
                          writeObject.blocknumber = blockNumber;
                          writeObject.chaincodeid = chaincodeID;
                          writeObject.timestamp = timestamp;
                          writeObject.transactionid = transactionID;
                          writeObject.transactionnum = transactionnum;
                          //commodity结构
                          writeObject.reads = rwSet[record].rwset.reads[0]; //读集的第一个key version
  
                         // console.log(`Transaction Timestamp: ${writeObject.timestamp}`);
                          //console.log(`ChaincodeID: ${writeObject.chaincodeid}`);
                          //console.log(writeObject.reads);
  
                          const logfilePath = path.resolve(__dirname, 'nextblocknew3.txt');
  
                          // send the object to a log file
                          fs.appendFileSync(channelname + '_' + chaincodeID + '.log', JSON.stringify(writeObject) + "\n");
  
                          // if couchdb is configured, then write to couchdb
                          if (use_couchdb) {
                              try {

                                  await writeValuesToCouchDBPwithcode(nano, channelname, writeObject);

                              } catch (error) {
  
                              }
                          }
                      }
                  };
              };

            } else{
                const transactionnum = dataItem;
                const timestamp = dataArray[dataItem].payload.header.channel_header.timestamp;
                // continue to next tx if no actions are set
                if (dataArray[dataItem].payload.data.actions == undefined) {
                    //continue();
                }
                //交易id
                const transactionID = dataArray[dataItem].payload.header.channel_header.tx_id;
    
                // actions are stored as an array. In Fabric 1.4.3 only one
                // action exists per tx so we may simply use actions[0]
                // in case Fabric adds support for multiple actions
                // a for loop is used for demonstration
                const actions = dataArray[dataItem].payload.data.actions;
                // iterate through all actions
                for (var actionItem in actions) {
    
                    // reject if a chaincode id is not defined
                    if (actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name == undefined) {
                        reject(new Error('Chaincode name is not defined'));
                    }
    
                    const chaincodeID = actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.chaincode_id.name
    
                    //合约参数{byte[][]}
                    var myargs = []; 
                    const args = actions[actionItem].payload.chaincode_proposal_payload.input.chaincode_spec.input.args;
                    for(var arg in args){
                        myargs.push(Buffer.from(args[arg], 'base64').toString('utf8')) ;
                        //console.log("args: " + Buffer.from(args[arg], 'base64').toString('utf8'));
                    }
                    var  isconsumecommodityTx = false;
                    if(myargs[0] == 'consumecommodity'){
                        isconsumecommodityTx = true;
                    }    
                    // reject if there is no readwrite set
                    if (actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset == undefined) {
                        reject(new Error('No readwrite set is defined'));
                    }
    
                    const rwSet = actions[actionItem].payload.action.proposal_response_payload.extension.results.ns_rwset
    
                    for (var record in rwSet) {
    
                        // ignore lscc events 
                        if (rwSet[record].namespace != 'lscc' && isconsumecommodityTx) {
                            // create object to store properties
                            const writeObject = new Object();
                            writeObject.myargs = myargs;
                            writeObject.transactionType = myargs[0];
                            writeObject.commodityID = myargs[1];
                            writeObject.consumerID = myargs[2];
    
                            writeObject.blocknumber = blockNumber;
                            writeObject.chaincodeid = chaincodeID;
                            writeObject.timestamp = timestamp;
                            writeObject.transactionid = transactionID;
                            writeObject.transactionnum = transactionnum;
                            //commodity结构
                            writeObject.reads = rwSet[record].rwset.reads[0];  //读集
                            writeObject.values = rwSet[record].rwset.writes;
    
                            //console.log(`Transaction Timestamp: ${writeObject.timestamp}`);
                            //console.log(`ChaincodeID: ${writeObject.chaincodeid}`);
                            //console.log(writeObject.reads);
    
                            const logfilePath = path.resolve(__dirname, 'nextblocknew3.txt');
    
                            // send the object to a log file
                            fs.appendFileSync(channelname + '_' + chaincodeID + '.log', JSON.stringify(writeObject) + "\n");
    
                            // if couchdb is configured, then write to couchdb
                            if (use_couchdb) {
                                try {
  
                                    await writeValuesToCouchDBP(nano, channelname, writeObject);
  
                                } catch (error) {
    
                                }
                            }
                        }
                    };
                };

            }

        };
        //console.timeEnd('processBlockEvent time');

        // update the nextblock.txt file to retrieve the next block
        fs.writeFileSync(configPath, parseInt(blockNumber, 10) + 1)

        resolve(true);

    }));
}

async function writeValuesToCouchDBP(nano, channelname, writeObject) {
    
    return new Promise((async (resolve, reject) => {
        try {

            // define the database for saving block events by key - this emulates world state
            
            // define the database for saving all block events - this emulates history
            const historydbnameread = channelname + '_' + writeObject.chaincodeid + '_test3consumecommoditytx';
            //console.log('historydbnameread: '+ historydbnameread);
            // set values to the array of values received
            var readkeyversion = writeObject.reads;
            //console.log('This is writeValuesToCouchDBP: ');
            //console.log(readkeyversion);

            try {
                var tmpversion = readkeyversion.version;
                var tmpkey = readkeyversion.key;
                var q = 0; 
    
                if (tmpversion == null){
                     q = {
                      selector: {
                        "$and": [
                            {
                                key: {
                                    "$eq": tmpkey
                                 }
                            },
                            {
                                version: {
                                    "$eq": null     
                                       }
                            }
                        ] 
                    },
                      limit:5
                    };
                  } else{
                    var tmpblocknum = parseInt(tmpversion.block_num, 10);
                    var tmptransanum = tmpversion.tx_num;
                    
                     q = {
                      selector: {
                         "$and": [
                            {
                                key: {
                                    "$eq": tmpkey
                                 }
                            },
                            {
                                blocknumber: {
                                    "$eq": tmpblocknum     
                                       }
                            },
                            {
                                transactionnum: {
                                    "$eq": tmptransanum     
                                       }
                            }
                        ] 
                    },
                      limit:5
                    };
                  }
                  const searchdbname = 'mychannel_edu_test1historywithvalue';
    
                  var doc = await couchdbutil.getfindoc(nano, searchdbname, q);

                
            
        } catch (error) {
            console.log(error);
            reject(error);
        }

            try {
                    // add additional fields for history                
                    readkeyversion.value =
                    doc.value;
                    readkeyversion.transactionType =
                        writeObject.transactionType;
                    readkeyversion.commodityID =
                        writeObject.commodityID;    
                    readkeyversion.consumerID =
                        writeObject.consumerID;                         
                    readkeyversion.transactionid =
                        writeObject.transactionid;
                    readkeyversion.timestamp =
                        writeObject.timestamp;
                    readkeyversion.transactionnum = parseInt(
                        writeObject.transactionnum,
                            10
                        );    
                    readkeyversion.blocknumber = parseInt(
                        writeObject.blocknumber,
                        10
                    );

                    await couchdbutil.writeToCouchDB(
                        nano,
                        historydbnameread,
                        null,
                        readkeyversion
                    );
                    
                
            } catch (error) {
                console.log(error);
                reject(error);
            }


        } catch (error) {
            console.error(`Failed to write to couchdb: ${error}`);
            reject(error);
        }



        const dbname = channelname + '_' + writeObject.chaincodeid;
        //This is world state!
        const values = writeObject.values;
        try {
            for (var sequence in values) {
                //write set
                let keyvalue =
                    values[
                    sequence
                    ];
                    if (
                        keyvalue.is_delete ==
                        true
                    ) {
                        await couchdbutil.deleteRecord(
                            nano,
                            dbname,
                            keyvalue.key
                        );
                    } else {
                        if (
                            isJSON(
                                keyvalue.value
                            )
                        ) {
                            //  insert or update value by key - this emulates world state behavior
                            await couchdbutil.writeToCouchDB(
                                nano,
                                dbname,
                                keyvalue.key,
                                JSON.parse(
                                    keyvalue.value
                                )
                            );
                        }
                    }
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }

        resolve(true);

    }));

}



async function writeValuesToCouchDBPwithcode(nano, channelname, writeObject) {

    return new Promise((async (resolve, reject) => {

        try {

            // define the database for saving block events by key - this emulates world state
            //const dbname = channelname + '_' + writeObject.chaincodeid;
            // define the database for saving all block events - this emulates history
            const historydbnameread = channelname + '_' + writeObject.chaincodeid + '_test3consumecommoditytxwithcode';
            //console.log('historydbnameread: '+ historydbnameread);
            // set values to the array of values received
            var readkeyversion = writeObject.reads;
            //console.log(readkeyversion);
            try {
                    // add additional fields for history                
                    readkeyversion.code =
                        writeObject.code;
                    readkeyversion.transactionType =
                        writeObject.transactionType;
                    readkeyversion.commodityID =
                        writeObject.commodityID;    
                    readkeyversion.consumerID =
                        writeObject.consumerID;                         
                    readkeyversion.transactionid =
                        writeObject.transactionid;
                    readkeyversion.timestamp =
                        writeObject.timestamp;
                    readkeyversion.transactionnum = parseInt(
                        writeObject.transactionnum,
                            10
                        );    
                    readkeyversion.blocknumber = parseInt(
                        writeObject.blocknumber,
                        10
                    );

                    await couchdbutil.writeToCouchDB(
                        nano,
                        historydbnameread,
                        null,
                        readkeyversion
                    );
                
            } catch (error) {
                console.log(error);
                reject(error);
            }


        } catch (error) {
            console.error(`Failed to write to couchdb: ${error}`);
            reject(error);
        }

        resolve(true);

    }));

}






function isJSON(value) {
    try {
        JSON.parse(value);
    } catch (e) {
        return false;
    }
    return true;
}
