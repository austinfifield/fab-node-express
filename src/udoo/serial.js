const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const tynt = require('tynt')
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const axios = require('axios');
const moment = require('moment')


port.on("open", () => {
    console.log(tynt.Blue('Serial port /dev/ttyACM0 is open\n'));
  });
  

// Read the serial data on the port
parser.on('data', data =>{
    console.log(tynt.Blue('Data received on serial port: ' + data));
    let transactionRequest = data.split(' ');

    let source = parseInt(transactionRequest[0]);
    let value = parseInt(transactionRequest[1]);
    let destination = parseInt(transactionRequest[2]);
 
    // Query
    if(source != 0 && value == 0 && destination == 0) {
        console.log(tynt.Yellow("Query"));

        axios.post('http://localhost:3000/assets', {
            iden: "iden" + source,
            idres: "idres" + source

        }).then(res => {
            console.log('Transaction Result: ' + source + " " + res.data + ' 0\n');
            port.write(source + " " + res.data + " " + 0 + '\n');
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
            port.write(source + " " + res.data + " " + 0 + '\n');
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
            port.write(source + " " + parseInt(res.data.consumed) + " " + source + '\n');
            // send new balance
            port.write(source + " " + parseInt(res.data.newBalance) + " " + 0 + '\n');

        }).catch(err => {
            console.log(err);
        })
    }


    // TRADE
    else if(source != 0 && value > 0 && destination != source && destination != 0) {
        var now = moment()
        var formatted = now.format('YYYY-MM-DD HH:mm:ss Z')
        console.log(formatted)
        console.log(tynt.Blue("Trade"))
        axios.post('http://localhost:3000/trade', {
            
            tokenInc: "idtok" + destination,
            energyInc: "iden" + source,
            rate: "1",
            energyDec : "iden" + destination,
            value: value,
            tokenDec: "idtok" + source,
            timestamp: formatted
            
        }).then(res => {
            // send amount consumed
            port.write(source + " " + res.data.amountSold + " " + destination + '\n')

            // send new balance
            port.write(destination + " " + res.data.sellerBalance + " " + 0 + '\n')

            switch(destination) {
                case 1: // House 1
                    console.log("House 1")
                    axios.post('http://192.168.1.101:3000/fabric', {
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
                    axios.post('http://192.168.1.102:3000/fabric', {
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
});

module.exports = {
  getData: function(data) {
    dataObj = JSON.parse(data);

    console.log(dataObj.source + " " + dataObj.value + " 0")
    port.write(dataObj.source + " " + dataObj.value + " 0" + '\n');
  }
}