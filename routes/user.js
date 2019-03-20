let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let resident = require('../src/CC/residents');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);


let resObj = {}

router.get("/", (req, res) => {
    let resident = req.body
    let token = {}
    let energy = {}


    fabService.query("admin", constants.getToken,[resident.idtok])
    .then(payload => {
        token = JSON.parse(payload)
        

        fabService.query("admin", constants.getEnergy,[resident.iden])
        .then(payload => {
            energy = JSON.parse(payload)
        })
        .then(() => {
            res.send("Resident Token Balance: " + token.value + 
            "\nResident Energy Balance: " + energy.value);
        })

    })
    .catch((err) => {
        res.send("error");
    })
});

module.exports = router;
