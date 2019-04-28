/*
noSerial.js - This file is used to test the network using a computer rather than an UDOO. It is exactly the same as
serial.js except there are no serial comm. You will need to change the function import in /fabric from serial.js to noSerial.js

The data is passed in as command line arguments:

    node ./src/udoo/noSerial.js 1 0 0

    will query House 1's energy balance

    node ./src/udoo/noSerial.js 2 5 4

    will have House 2 buy 5 energy from House 4

    etc

*/
const tynt = require('tynt')
const axios = require('axios');
const moment = require('moment')

let source = parseInt(process.argv[2]);
let value = parseInt(process.argv[3]);
let destination = parseInt(process.argv[4]);
 
// Query
if(source != 0 && value == 0 && destination == 0) {
    console.log(tynt.Yellow("Query"));

    axios.post('http://localhost:3000/assets', {
        iden: "iden" + source,
        idres: "idres" + source

    }).then(res => {
        console.log('Transaction Result: ' + source + " " + res.data + ' 0\n');
    })
    .catch(err => {
        console.log(err)
    })
}

// Produce
else if(source != 0 && value > 0 && destination == 0) {
    console.log(tynt.Green("Produce"));

    axios.post('http://localhost:3000/produce', {
        owner: "House" + source,
        ownerType: "Resident",
        iden: "iden" + source,
        value: value,
        idres: "idres" + source

    }).then(res => {
        console.log('Transaction Result: ' + source + " " + res.data + ' 0\n');
        
    })
    .catch(err => {
        console.log(err)
    })
}

// Consume
else if(source != 0 && value > 0 && source == destination) {
    console.log(tynt.Red("Consume"));

    axios.post('http://localhost:3000/consume', {
        owner: "House" + source,
        ownerType: "Resident",
        iden: "iden" + source,
        value: value,
        idres: "idres" + source

    }).then(res => {
        // send amount consumed
        console.log(source + " " + parseInt(res.data.consumed) + " " + source + '\n');
        // send new balance
        console.log(source + " " + parseInt(res.data.newBalance) + " " + 0 + '\n');

    }).catch(err => {
        console.log(err);
    })
}


// TRADE
else if(source != 0 && value > 0 && destination != source && destination != 0) {
    var now = moment()
    var formatted = now.format('YYYY-MM-DD HH:mm:ss Z')
    console.log(formatted)
    console.log(tynt.Blue("TRADE"))
    axios.post('http://localhost:3000/trade', {
        
        tokenInc: "idtok" + destination,
        energyInc: "iden" + source,
        rate: "1",
        energyDec : "iden" + destination,
        value: value.toString(),
        tokenDec: "idtok" + source,
        timestamp: formatted
        
    }).then(res => {
        // send amount consumed
        console.log(source + " " + parseInt(res.data.amountSold) + " " + destination + '\n')

        // send new balance
        console.log(destination + " " + parseInt(res.data.sellerBalance) + " " + 0 + '\n')

        switch(destination) {
            case 1: // House 1
                console.log("House 1")
                axios.post('http://192.168.1.235:3000/fabric', {
                    source: destination,
                    value: res.data.sellerBalance
                })
                .then(res => {
                    console.log("success")    
                })
                .catch(err => {
                    console.log(err)
                })
                break;

            case 2: // House 2
                console.log("House 2")
                axios.post('http://192.168.1.25:3000/fabric', {
                    source: destination,
                    value: res.data.sellerBalance
                })
                .then(res => {
                    console.log("success")    
                })
                .catch(err => {
                    console.log(err)
                })
                break;

            case 3: 
                console.log("House 3")
                axios.post('http://192.168.1.103:3000/fabric', {
                    source: destination,
                    value: res.data.sellerBalance
                })
                .then(res => {
                    console.log("success")    
                })
                .catch(err => {
                    console.log(err)
                })
                break;

            case 4: 
                console.log("House 4")
                axios.post('http://192.168.1.104:3000/fabric', {
                    source: destination,
                    value: res.data.sellerBalance
                })
                .then(res => {
                    console.log("success")    
                })
                .catch(err => {
                    console.log(err)
                })
                break;

            case 5: 
                console.log("House 5")
                axios.post('http://192.168.1.105:3000/fabric', {
                    source: destination,
                    value: res.data.sellerBalance
                })
                .then(res => {
                    console.log("success")    
                })
                .catch(err => {
                    console.log(err)
                })
                break;

            case 6: 
                console.log("House 6")
                axios.post('http://192.168.1.106:3000/fabric', {
                    source: destination,
                    value: res.data.sellerBalance
                })
                .then(res => {
                    console.log("success")    
                })
                .catch(err => {
                    console.log(err)
                })
                break;
            default:
                console.log("NO HOUSE " + destination + "!") 
        }
    })
    .catch(err => {
        console.log(err)
    })
}
module.exports = {
  getData: function(data) {
    console.log("from serial.js: " + data);
    dataObj = JSON.parse(data);

    console.log(dataObj.source + " " + dataObj.value + " 0")

  }
}