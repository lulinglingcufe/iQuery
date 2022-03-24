/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 * 
 */

/*
 *
 * addcommoditys.js will add random sample data to blockchain.
 *
 *    $ node addcommoditys.js
 *
 * addcommoditys will add 10 commoditys by default with a starting commodity name of "commodity100".
 * Additional commoditys will be added by incrementing the number at the end of the commodity name.
 *
 * The properties for adding commoditys are stored in addcommoditys.json.  This file will be created
 * during the first execution of the utility if it does not exist.  The utility can be run
 * multiple times without changing the properties.  The nextcommodityNumber will be incremented and
 * stored in the JSON file.
 *
 *    {
 *        "nextcommodityNumber": 100,
 *        "numbercommoditysToAdd": 10
 *    }
 *
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const addcommoditysConfigFile = path.resolve(__dirname, 'addcommoditys.json');

const prices=[ 'blue', 'red', 'yellow', 'green', 'white', 'purple' ];
const owners=[ 'tom', 'fred', 'julie', 'james', 'janet', 'henry', 'alice', 'marie', 'sam', 'debra', 'nancy'];
const sizes=[ 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ];
const docType='commodity'

const config = require('./config.json');
const channelid = config.channelid;

async function main() {

    try {

        let nextcommodityNumber;
        let numbercommoditysToAdd;
        let addcommoditysConfig;

        // check to see if there is a config json defined
        if (fs.existsSync(addcommoditysConfigFile)) {
            // read file the next commodity and number of commoditys to create
            let addcommoditysConfigJSON = fs.readFileSync(addcommoditysConfigFile, 'utf8');
            addcommoditysConfig = JSON.parse(addcommoditysConfigJSON);
            nextcommodityNumber = addcommoditysConfig.nextcommodityNumber;
            numbercommoditysToAdd = addcommoditysConfig.numbercommoditysToAdd;
        } else {
            nextcommodityNumber = 100;
            numbercommoditysToAdd = 20;
            // create a default config and save
            addcommoditysConfig = new Object;
            addcommoditysConfig.nextcommodityNumber = nextcommodityNumber;
            addcommoditysConfig.numbercommoditysToAdd = numbercommoditysToAdd;
            fs.writeFileSync(addcommoditysConfigFile, JSON.stringify(addcommoditysConfig, null, 2));
        }

        // Parse the connection profile. This would be the path to the file downloaded
        // from the IBM Blockchain Platform operational console.
        const ccpPath = path.resolve(__dirname, '..', 'first-network', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Configure a wallet. This wallet must already be primed with an identity that
        // the application can use to interact with the peer node.
        const walletPath = path.resolve(__dirname, 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway, and connect to the gateway peer node(s). The identity
        // specified must already exist in the specified wallet.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network channel that the smart contract is deployed to.
        const network = await gateway.getNetwork(channelid);

        // Get the smart contract from the network channel.
        const contract = network.getContract('commoditys');

        for (var counter = nextcommodityNumber; counter < nextcommodityNumber + numbercommoditysToAdd; counter++) {

            var randomprice = Math.floor(Math.random() * (6));
            var randomOwner = Math.floor(Math.random() * (11));
            var randomSize = Math.floor(Math.random() * (10));

            // Submit the 'initcommodity' transaction to the smart contract, and wait for it
            // to be committed to the ledger.
            await contract.submitTransaction('initcommodity', docType+counter, prices[randomprice], ''+sizes[randomSize], owners[randomOwner]);
            console.log("Adding commodity: " + docType + counter + "   owner:"  + owners[randomOwner] + "   price:" + prices[randomprice] + "   size:" + '' + sizes[randomSize] );

        }

        await gateway.disconnect();

        addcommoditysConfig.nextcommodityNumber = nextcommodityNumber + numbercommoditysToAdd;

        fs.writeFileSync(addcommoditysConfigFile, JSON.stringify(addcommoditysConfig, null, 2));

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }

}

main();
