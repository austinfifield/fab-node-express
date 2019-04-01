let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);


let resObj = {}

router.post("/", (req, res) => {
    let resident = req.body
    
    // Query resident token balance
    fabService.query("admin", constants.getEnergy,[resident.iden])
    // Promise to return payload
    .then(payload => {
        energy = JSON.parse(payload)
        .then(() => {
            res.send(energy.value)
        })
    })
    .catch((err) => {
        res.send(err);
    })
});


router.get("/", (req, res) => {
    let resident = req.body;

    tokObj = {
        owner: resident.owner,
        ownerType: resident.ownerType,
        id: resident.idtok,
        value: resident.tokValue
        };

    enObj = {
        owner: resident.owner,
        ownerType: resident.ownerType,
        id: resident.iden,
        value: resident.enValue
    }

    cashObj = {
        owner: resident.owner,
        ownerType: resident.ownerType,
        id: resident.idcash,
        value: resident.cashValue
    }

    let tokArgs = [resident.idres, JSON.stringify(tokObj)];
    let enArgs = [resident.idres, JSON.stringify(enObj)];
    let cashArgs = [resident.idres, JSON.stringify(cashObj)];


    fabService.invoke("admin", constants.createToken, tokArgs)
        .then(() => {
            fabService.invoke("admin", constants.createEnergy, enArgs)

            .then(() => {
                fabService.invoke("admin", constants.createCash, cashArgs)
            })

            .then(() => {
                res.send("Assets created:\n" + tokArgs + "\n" + enArgs + "\n" + cashArgs);
            })
            .catch(err => {
                res.send(err);
            })
        })
        .catch(err => {
            res.send(err);
        })
});

module.exports = router;
