let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let resident = require('../src/CC/residents');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);


let resObj = {}

router.get("/", (req, res) => {
    let resident = req.body
    fabService.query(resident.firstName, constants.getResident, [resident.id])
    .then(payload => {
        res.send("User Queried: " + payload);
    })
    .catch((err) => {
        res.send("error");
    })
});

module.exports = router;
