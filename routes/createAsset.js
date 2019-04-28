/*
createAsset.js - This endpoint will recieve POST requests to CREATE assets for the network. The asset just needs to be created once unless
the docker containers for the chaincode are brought down; if that happends you will have to recreate everything. You can use POSTMAN/cURL or
the createAssets.py located in the app root folder.
*/

let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);

// GET request, currently useless
router.get("/", (req, res) => {
    res.send("Get request does nothing");
});

// POST request
router.post("/", (req, res) => {
    let resident = req.body;

    // Token object to create tokens
    tokObj = {
        owner: resident.owner,
        ownerType: resident.ownerType,
        id: resident.idtok,
        value: resident.tokValue
        };

    // Energy object to create energy
    enObj = {
        owner: resident.owner,
        ownerType: resident.ownerType,
        id: resident.iden,
        value: resident.enValue
    }

    // Cash object to create cash
    cashObj = {
        owner: resident.owner,
        ownerType: resident.ownerType,
        id: resident.idcash,
        value: resident.cashValue
    }

    // Arguments passed into the functions
    let tokArgs = [resident.idres, JSON.stringify(tokObj)];
    let enArgs = [resident.idres, JSON.stringify(enObj)];
    let cashArgs = [resident.idres, JSON.stringify(cashObj)];

    // Invokes the chaincode to create the above assets
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
