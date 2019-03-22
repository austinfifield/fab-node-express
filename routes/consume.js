let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);


let resObj = {}

router.get("/", (req, res) => {
    res.send("Under construction...")
});

router.post("/", (req, res) => {
    res.send("Under construction...")
});

module.exports = router;
