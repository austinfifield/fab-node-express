/*
serial.js - This file will open up the interal serial port connecting the operating system (OS) and the arduino microcontroller (MCU)
allowing the analog signals recieved by the GPIO pins of the MCU to be used in the express app running on the OS.

Once the data has been sent to the node app serial.js will wait patiently for it to recieve the transaction results. Then serial.js will
send the data back to the arduino MCU and finally to the LCD displays.

*/


// Modules needed for serial port comm
const SerialPort = require('serialport');
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const Readline = require('@serialport/parser-readline');
const parser = port.pipe(new Readline({ delimiter: '\n' }));

// Used to add color to console.logs!
const tynt = require('tynt') 
// Used for http requests
const axios = require('axios');
// Used for adding timestamps
const moment = require('moment')

// Opens the serial comm port
port.on("open", () => {
    console.log(tynt.Blue('Serial port /dev/ttyACM0 is open\n'));
  });


// Reads in the data
parser.on('data', data =>{
    console.log(tynt.Blue('Data received on serial port: ' + data)); 
    let transactionRequest = data.split(' '); // Splits the data into a character array

    // Assigns each of the three incomming numbers to a variable
    let buyer = parseInt(transactionRequest[0]); // This is the number of the UDOO device who initialize the function (Node 1 == 1, Node 2 == 2, etc)
    let value = parseInt(transactionRequest[1]); // The value to be consumed/produced/traded (left 0 to query)
    let seller = parseInt(transactionRequest[2]); // The 2nd party of the transaction (left 0 to query)
 
    // Query Function
    if(buyer != 0 && value == 0 && seller == 0) {
        console.log(tynt.Yellow("Query"));

        // Sends an object containing the necessary data for querying. The object is sent to the "assets" endpoint.
        axios.post('http://localhost:3000/assets', {
            iden: "iden" + buyer, // The energy ID (iden#)
            idres: "idres" + buyer // The resident ID (idres#)

        }).then(res => {
            // Displays the querried transaction result
            console.log('Transaction Result: ' + buyer + " " + res.data + ' 0\n');
            port.write(buyer + " " + res.data + " " + 0 + '\n');
        })
        .catch(err => {
            console.log(err)
        })
    }

    // Produce Function
    else if(buyer != 0 && value > 0 && seller == 0) {
        console.log(tynt.Green("Produce"));

        // Sends an object containing the necessary data for producing energy. The object is sent to the "produce" endpoint.
        axios.post('http://localhost:3000/produce', {
            owner: "House" + buyer, // The owner of the energy token (House#)
            ownerType: "Resident",
            iden: "iden" + buyer,
            value: value,
            idres: "idres" + buyer

        }).then(res => {
            // Send updated balance
            console.log('Transaction Result: ' + buyer + " " + res.data + ' 0\n');
            port.write(buyer + " " + res.data + " " + 0 + '\n');
        })
        .catch(err => {
            console.log(err)
        })
    }

    // Consume Function
    else if(buyer != 0 && value >= 0 && buyer == seller) {
        console.log(tynt.Red("Consume"));

        // Sends an object containing the necessary data for coonsuming energy. The object is sent to the "consume" endpoint.
        axios.post('http://localhost:3000/consume', {
            owner: "House" + buyer,
            ownerType: "Resident",
            iden: "iden" + buyer,
            value: value,
            idres: "idres" + buyer

        }).then(res => {
            // send amount consumed
            console.log('Transaction Result: ' + buyer + " " + parseInt(res.data.consumed) + " " + buyer + '\n');
            port.write(buyer + " " + parseInt(res.data.consumed) + " " + buyer + '\n');
            // send new balance
            console.log('Transaction Result: ' + buyer + " " + parseInt(res.data.newBalance) + " " + 0 + '\n');
            port.write(buyer + " " + parseInt(res.data.newBalance) + " " + 0 + '\n');

        }).catch(err => {
            console.log(err);
        })
    }


    // TRADE
    else if(buyer != 0 && value > 0 && seller != buyer && seller != 0) {
        // Get current data + time for timestamp
        var now = moment()
        // Makes the timestamp look pretty
        var formatted = now.format('YYYY-MM-DD HH:mm:ss Z')
        console.log(tynt.Blue("Trade @ " + formatted))
    
        // Sends an object containing the necessary data to trade energy. The object is sent to the "trade" endpoint.
        axios.post('http://localhost:3000/trade', {
            
            tokenInc: "idtok" + seller, // token ID (idtok#) of the seller
            energyInc: "iden" + buyer, // energy ID (iden#) of the buyer
            rate: "1", // exchange rate
            energyDec : "iden" + seller, // energy ID (iden#) of the seller
            value: value.toString(),
            tokenDec: "idtok" + buyer, // token ID (idtok#) of the buyer
            timestamp: formatted, // timestamp
            buyer: buyer // holds onto the buyer # (1-6) needed at the trade endpoint to fix the energy balance after the trade
            
        }).then(res => {
            // send amount consumed
            console.log('Transaction Result: ' + buyer + " " + res.data.amountSold + " " + seller + '\n');
            port.write(buyer + " " + res.data.amountSold + " " + seller + '\n')

            // send new balance
            console.log('Transaction Result: ' + seller + " " + res.data.sellerBalance + " " + 0 + '\n');
            port.write(seller + " " + res.data.sellerBalance + " " + 0 + '\n')

            // Based on the number associated with the seller variable, this will route the updated balance to the correct UDOO IP address.
            switch(seller) {
                case 1: // House 1
                    console.log("House 1")
                    axios.post('http://192.168.1.101:3000/fabric', {
                        buyer: seller,
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
                        buyer: seller,
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
                        buyer: seller,
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
                        buyer: seller,
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
                        buyer: seller,
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
                        buyer: seller,
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
                    console.log("NO HOUSE " + seller + "!") 
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
});


// Once the switch statement above sends a POST request to the correct UDOO IP:3000/fabric, this function will be able to pass the data
// To the correct UDOO's serial.js.
module.exports = {
  getData: function(data) {
    console.log("from serial.js: " + data);
    dataObj = JSON.parse(data);

    console.log(dataObj.buyer + " " + dataObj.value + " 0")
    port.write(dataObj.buyer + " " + dataObj.value + " 0" + '\n');
  }
}