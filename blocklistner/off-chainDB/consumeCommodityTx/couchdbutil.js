/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 * 
 */

'use strict';

exports.createDatabaseIfNotExists = function (nano, dbname) {

    return new Promise((async (resolve, reject) => {
        await nano.db.get(dbname, async function (err, body) {
            if (err) {
                if (err.statusCode == 404) {
                    await nano.db.create(dbname, function (err, body) {
                        if (!err) {
                            resolve(true);
                        } else {
                            reject(err);
                        }
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(true);
            }
        });
    }));
}


exports.getfindoc = function (nano, searchdbname,qselctor) {

    return new Promise((async (resolve, reject) => {

        const alice = nano.use(searchdbname);
        // var q4 = {
        //     selector: {
        //       "$and": [
        //           {
        //               key: {
        //                   "$eq": "User_19@AAAAA.com"
        //                }
        //           },
        //           {
        //             transactionid: {
        //                   "$eq": "a3c2a1665518c7aac6602e0b476572f73e626cf9aae03acb68a622c6239c23dc"     
        //                      }
        //           }
        //       ] 
        //   },
        //     limit:5
        //   };
          var finddoc;

          await alice.find(qselctor,(err, response) => {
            //console.log('This is finddoc!')
            finddoc =  response.docs[0];
            //console.log(finddoc);
            resolve(finddoc);
            });

          

    }));
}

exports.getfinddata = function (nano, dbname) {

    return new Promise((async (resolve, reject) => {

        const alice = nano.use('mychannel_edu_historywithvaluetest');
        var q4 = {
            selector: {
              "$and": [
                  {
                      key: {
                          "$eq": "User_19@AAAAA.com"
                       }
                  },
                  {
                    transactionid: {
                          "$eq": "a3c2a1665518c7aac6602e0b476572f73e626cf9aae03acb68a622c6239c23dc"     
                             }
                  }
              ] 
          },
            limit:5
          };
          var finddoc;

          await alice.find(q4,(err, response) => {
            console.log('This is finddoc!')
            finddoc =  response.docs[0];
            console.log(finddoc);
            resolve(finddoc);
            });

          

    }));
}



exports.writeToCouchDB = async function (nano, dbname, key, value) {

    return new Promise((async (resolve, reject) => {
        


        try {
            await this.createDatabaseIfNotExists(nano, dbname);
        } catch (error) {

        }

        const db = nano.use(dbname);

        // If a key is not specified, then this is an insert
        if (key == null) {
            db.insert(value, async function (err, body, header) {
                if (err) {
                    reject(err);
                }
            }
            );
            //console.log('Successfullt insert record!')
        } else {

            // If a key is specified, then attempt to retrieve the record by key
            db.get(key, async function (err, body) {
                // parse the value
                const updateValue = value;
                // if the record was found, then update the revision to allow the update
                if (err == null) {
                    updateValue._rev = body._rev
                }
                // update or insert the value
                db.insert(updateValue, key, async function (err, body, header) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        }

        

        resolve(true);

    }));
}


exports.deleteRecord = async function (nano, dbname, key) {

    return new Promise((async (resolve, reject) => {

        try {
            await this.createDatabaseIfNotExists(nano, dbname);
        } catch (error) {

        }

        const db = nano.use(dbname);

        // If a key is specified, then attempt to retrieve the record by key
        db.get(key, async function (err, body) {

            // if the record was found, then update the revision to allow the update
            if (err == null) {

                let revision = body._rev

                // update or insert the value
                db.destroy(key, revision, async function (err, body, header) {
                    if (err) {
                        reject(err);
                    }
                });

            }
        });

        resolve(true);

    }));
}
