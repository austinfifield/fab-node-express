let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let resident = require('../src/CC/residents');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);


router.post("/", (req, res) => {
    let resident = req.body;

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

        let args = [resident.id, JSON.stringify(resObj)];

    fabService.makeUser(resident.alias, resident.password)
    .then(() => {
        fabService.invoke(resident.alias, constants.createResident, args)
    })
    .then(() => {
        res.send("success");
    })

});



module.exports = router;
