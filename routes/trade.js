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

    let args = [JSON.stringify(resident)]

    fabService.invoke("admin", constants.trade, args)
    .then(() => {
        fabService.query("admin", constants.getEnergy, [resident.energyInc])
        .then((buyer) => {
            buyerBalance = JSON.parse(buyer);
        })
        .then(() => {
            fabService.query("admin", constants.getEnergy, [resident.energyDec])
            .then(seller => {
                sellerBalance = JSON.parse(seller);
            })
            .then(() => {
                
                transObj = {
                    buyer: parseInt(buyerBalance.value) + parseInt(resident.value),
                    seller: parseInt(sellerBalance.value) - parseInt(resident.value)
                }
                console.log(transObj)
                res.send(JSON.stringify(transObj))
            })
        })

    })            
});

module.exports = router;