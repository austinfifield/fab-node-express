let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);

// Get all transactions from a specific resident

router.get("/", (req, res) => {
    let resident = req.body
    fabService.query("admin", constants.getTransactions, [resident.id])
    .then(payload => {
        res.send("Transactions: " + payload);
    })
});


// Invoke a transaction:
// Either between two different residents (Houses) or,
// Consume ones own energy or,
// Produce energy
router.post("/", (req, res) => {

    let buyer = {}
    let seller = {}
    let balance;
    let cost;

    // Recieve transaction data
    let resident = req.body
    let args = [JSON.stringify(resident)]

    // Check balances
    fabService.query("admin", constants.getToken, [resident.tokenDec])
        .then((payload) => {
            buyer = JSON.parse(payload)
            balance = parseInt(buyer.value)
            cost = parseInt(resident.value)
            // res.send("Balance " + balance + 
            //             "\nPrice " + cost)
        }).then(() => {
            if(balance < cost) {
                res.send("Insufficient funds!")
            }
            else {
                fabService.invoke("admin", constants.trade, args)
                .then((txId) => {
                    console.log("transaction successful with txID: " + txId)
                    res.send("transaction successful with txID: " + txId)
                })
            }
        })
        .catch(err => {
            res.send(err)
        })
});

module.exports = router;