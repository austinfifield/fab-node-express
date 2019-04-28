/*
trade.js - This is the trade route/endpoint that handles all of the trade requests to the blockchain.
It recieves data via POST request from serial.js and then sends the transaction results as a response.
*/

let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);

// Get all transactions from a specific resident (NOT CURRENTLY USED FOR ANYTHING)
router.get("/", (req, res) => {
    let resident = req.body
    fabService.query("admin", constants.getTransactions, [resident.idres])
    .then(payload => {
        res.send("Transactions: " + payload);
    })
    .catch(err => {
        res.send(err)
    })
});


// POST request
router.post("/", (req, res) => {

    // Recieve transaction data
    let resident = req.body
    console.log(resident);
    let args = JSON.stringify(resident);
    // Variables
    let amountSold = 0;
    let sellerBalance = 0;
    let valueInt = 0;
    let buyerBalance = 0;
    let args1 = {};

    // We need to check that the person selling energy has enough to sell
    // The person selling energy with be the energy decreasing ID
    fabService.query("admin", constants.getEnergy, [resident.energyDec])
    .then(payload => {
        console.log("QUERYING SELLER")
        // The response from the blockchain query
        payloadObj = JSON.parse(payload)

        // extracts the account balance
        sellerBalanceInt = parseInt(payloadObj.value);

        // Convert to integer for math operations
        valueInt = parseInt(resident.value);
        amountSold = valueInt;

        // Do the evaluation
        if(sellerBalanceInt < valueInt) {
            // If the sellers balance is less than the amount being purchased, then the seller will sell just what they have.
            amountSold = sellerBalance;
        }
    }).then(() => {
        // This query is to get the buyers CURRENT balance BEFORE the trade. This is used to "fix" their available balance later.
        fabService.query("admin", constants.getEnergy, [resident.energyInc])
        .then((payload1) => {
            console.log("QUERYING BUYER")
            payloadObj1 = JSON.parse(payload1);
            buyerBalance = parseInt(payloadObj1.value);
            console.log("BUYER BALANCE: " + buyerBalance)
        })

        resObj1 = {
            owner: "House" + resident.buyer,
            ownerType: "Resident",
            iden: "iden" + resident.buyer,
            value: JSON.stringify(buyerBalance),
            idres: "idres" + resident.buyer
            }
        args1 = [resObj1.idres, JSON.stringify(resObj1)];


    }).then(() => {
        fabService.invoke("admin", constants.createEnergy, args1);
        // Preventative
        if(amountSold != 0 || amountSold != '0') {
            fabService.invoke("admin", constants.trade, [args])
            console.log("INVOKING TRADE");
            // Stores the sellers new balance after the trade, will be sent back to update balance.
            sellerBalanceInt = sellerBalanceInt - amountSold;
        }
    }).then(() => {
        // will be the arguments used to "consume" the extra energy from the buyer. Currently the trade adds the energy bought to the total balance
        // We want that energy to be consumed immediately after purchased.

        fabService.invoke("admin", constants.createEnergy, args1)
        transObj = {
            amountSold: parseInt(amountSold),
            sellerBalance: parseInt(sellerBalanceInt)
        }
    }).then(() => {
        console.log(transObj);
        res.send(JSON.stringify(transObj))
    }).catch(err => {
        console.log(err)
    })

 })         

module.exports = router;