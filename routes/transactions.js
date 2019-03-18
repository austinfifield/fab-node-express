let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let resident = require('../src/CC/residents');
let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);
let shell = require('shelljs');
let process = require('process');

router.get("/", (req, res) => {
    let resident = req.body
    fabService.query(resident.alias, constants.getTransactions, [resident.id])
    .then(payload => {
        res.send("Transactions: " + payload);
    })
});

router.post("/", (req, res) => {

    
    let source = {};
    let destination = {};
    let resident = req.body;

    fabService.query(resident.source, constants.getResident, [resident.sourceID])
    .then(payload => {
        source = JSON.parse(payload);
        //console.log("first query here");
        //res.send(payload);
    }).then( () => {
  
        fabService.query(resident.source, constants.getResident, [resident.destinationID])
        .then(payload => {
            //console.log("second query here")
            destination = JSON.parse(payload);
        }).then( () => {
            //console.log("script")
            process.chdir('../fabric-network/networkup/docker/');
            let time = Date.now();
            //console.log(source.tokens)
            console.log("./fabric.sh invoke defaultcc v1 '{\"Args\":[\"EnergyTokenTransaction\",\"{\\\"tokenInc\\\":\\\"" + source.tokens + "\\\",\\\"energyInc\\\":\\\"" + destination.energy + "\\\",\\\"rate\\\":\\\"0.83\\\",\\\"energyDec\\\":\\\"" + source.energy + "\\\",\\\"value\\\":\\\"5\\\",\\\"tokenDec\\\":\\\"" + destination.tokens + "\\\",\\\"transactionId\\\":\\\"transactionId\\\",\\\"timestamp\\\":\\\"2000-01-23T04:56:07.000+00:00\\\"}\"]}'")
            shell.exec("./fabric.sh invoke defaultcc v1 '{\"Args\":[\"EnergyTokenTransaction\",\"{\\\"tokenInc\\\":\\\"" + source.tokens + "\\\",\\\"energyInc\\\":\\\"" + destination.energy + "\\\",\\\"rate\\\":\\\"0.83\\\",\\\"energyDec\\\":\\\"" + source.energy + "\\\",\\\"value\\\":\\\"5\\\",\\\"tokenDec\\\":\\\"" + destination.tokens + "\\\",\\\"transactionId\\\":\\\"transactionId\\\",\\\"timestamp\\\":\\\"" + time + "\\\"}\"]}'")
         
        })   .then( () => {
            res.send("Success")
        })    .catch((err) => {
            res.send(err + " Error")
        })
    
    })

 

 



    // resObj = {
    //     source: resident.source,
    //     sourceID: resident.sourceID,
    //     destination: resident.destination,
    //     destinationID: resident.destinationID,
    //     energyAmount: resident.energyAmount
    //     };

    // let args = [resident.id, JSON.stringify(resObj)];


    // fabService.trade(resident.source, resident.destination, resident.energyAmount, constants.trade, args)
    // .then(() => {
    //     res.status(200).send("status 200, Resident " + resident.firstName + " " + resident.lastName + ", ALIAS: " + resident.alias);
    //     res.status(500).send("status 500, failed")
    //     res.status(404).send("status 404, failed")
    // })
})
module.exports = router;

// \'{\"Args\":[\"EnergyTokenTransaction\",\"{\"tokenInc\":\"" + source.tokens + "\",\"energyInc\":\"" + destination.energy + "\",\"rate\":\"0.83\",\"energyDec\":\"" + source.energy + "\",\"value\":\"5\",\"tokenDec\":\"" + destination.tokens + "\",\"transactionId\":\"transactionId\",\"timestamp\":\"" + time + "\"}\"]}'"