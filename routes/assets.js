/*
assets.js - This endpoint will recieve POST requests to QUERY a residents asset. This is used in the QUERY function in serial.js/noSerial.js
*/

let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);

// POST request
router.post("/", (req, res) => {
    let resident = req.body
    
    // Query resident token balance
    fabService.query("admin", constants.getEnergy,[resident.iden])
    // Promise to return payload
    .then(payload => {
        res.send(JSON.parse(payload).value)
       
    })
    .catch((err) => {
        res.send(err);
    })
});

// GET request, currently useless
router.get("/", (req, res) => {
    res.send("Get request does nothing");
});

module.exports = router;






