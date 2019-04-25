let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);

// Get all transactions from a specific resident

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


// Invoke a transaction:
// Either between two different residents (Houses) or,
// Consume ones own energy or,
// Produce energy
router.post("/", (req, res) => {

    // Recieve transaction data
    let resident = req.body
    console.log(resident);
    let args = JSON.stringify(resident);
    // Variables
    let amountSold = 0;
    let sellerBalance = 0;
    let valueInt = 0;

    // We need to check that the person selling energy has enough to sell
    // The person selling energy with be the energy decreasing ID
    fabService.query("admin", constants.getEnergy, [resident.energyDec])
    .then(payload => {
        
        payloadObj = JSON.parse(payload)

        sellerBalanceInt = parseInt(payloadObj.value);
        valueInt = parseInt(resident.value);
        amountSold = valueInt;
        // Do the evaluation
        if(sellerBalanceInt < valueInt) {
            
            amountSold = sellerBalance;
        }
    }).then(() => {
        if(amountSold != 0 || amountSold != '0') {
            fabService.invoke("admin", constants.trade, [args])
            sellerBalanceInt = sellerBalanceInt - amountSold;
        }
    }).then(() => {

        transObj = {
            amountSold: parseInt(amountSold),
            sellerBalance: parseInt(sellerBalanceInt)
        }
        console.log(transObj);
        res.send(JSON.stringify(transObj))
    }).catch(err => {
        console.log(err)
    })

 })         

module.exports = router;


// fabService.invoke("admin", constants.trade, args)
// .then(() => {
//     fabService.query("admin", constants.getEnergy, [resident.energyInc])
//     .then((buyer) => {
//         buyerBalance = JSON.parse(buyer);
//     })
//     .then(() => {
//         fabService.query("admin", constants.getEnergy, [resident.energyDec])
//         .then(seller => {
//             sellerBalance = JSON.parse(seller);
//         })
//         .then(() => {
            
//             transObj = {
//                 buyer: parseInt(buyerBalance.value) + parseInt(resident.value),
//                 seller: parseInt(sellerBalance.value) - parseInt(resident.value)
//             }
//             console.log(transObj)
//             res.send(JSON.stringify(transObj))
//         })
//     })

// })            
// });