/*
createUser.js - This endpoint will recieve POST requests to CREATE residents for the network. The resident just needs to be created once unless
the docker containers for the chaincode are brought down; if that happends you will have to recreate everything. You can use POSTMAN/cURL or
the createUser.py located in the app root folder.
*/


let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);

let resObj = {}

// GET request, currently useless
router.get("/", (req, res) => {
    res.send("Get request does nothing.");
});

// POST request
router.post("/", (req, res) => {
    // Reads in the request body
    let resident = req.body;

    // Creates a resident object
    resObj = {
        firstName: resident.firstName,
        lastName: resident.lastName,
        alias: resident.alias,
        tokens: resident.tokens,
        id: resident.id,
        type: resident.type,
        cash: resident.cash,
        energy: resident.energy
        };

        // Arguments needed for invoking the blockchain
        let args = [resident.id, JSON.stringify(resObj)];
    
    // Creates a user for the SDK ONLY! you still need to invoke the blockchain! These will appear in the appRoot/tmp directory
    // If the docker container for the chaincode is ever restarted you will have to delete the tmp folder and recreate the residents
    fabService.makeUser(resident.alias, "123456")
    .then(() => {

        // Here the blockchain is invoked! great success!
        fabService.invoke(resident.alias, constants.createResident, args)
    })
    .then(() => {
        res.status(200).send("status 200, Resident " + resident.firstName + " " + resident.lastName + ", ALIAS: " + resident.alias);
        res.status(500).send("status 500, failed")
        res.status(404).send("status 404, failed")
    })

});

module.exports = router;
