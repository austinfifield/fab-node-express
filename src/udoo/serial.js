/*  
    This script: 
    - Receives a transaction request via serial port from the Arduino
    - Prints and organizes the data in a terminal
    - Sends the transaction request to a WebSocket Server on localhost:3000
    - Receives a transaction result from the Websocket Server
    - Sends the result back to the serial port as a string to the Arduino
*/

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events');
const WebSocket = require('ws')
const tynt = require('tynt')
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const emitter = new EventEmitter();


port.on("open", () => {
    console.log(tynt.Blue('Serial port /dev/ttyACM0 is open\n'));
  });
  
// Display "New Transaction Request" when new serial data is received
emitter.on('newTransactionRequest', function(){
  console.log(tynt.Blue('New Transaction Request\n'));
});

// Read the serial data on the port
parser.on('data', data =>{
  const socket = new WebSocket('ws://localhost:3000/')
  console.log(tynt.Blue('Data received on serial port: ' + data));



  // Split data string in to an array to print nice stuff in the terminal
  var transactionRequest = data.split(' ');

  // if (transactionRequest[2] == 0){
  //   console.log('Producer: ', transactionRequest[0]);
  //   console.log('Energy: ', transactionRequest[1]);
  // }
  // else {
  //   console.log('Buyer: ', transactionRequest[0]);
  //   console.log('Energy: ', transactionRequest[1]);
  //   console.log('Seller: ', transactionRequest[2]);
  // }
  let source = transactionRequest[0].toString();
  let value = transactionRequest[1].toString();
  let destination = transactionRequest[2].toString();

  //-------------START LOGIC--------------------------

  if(source == 0) {
    console.log(tynt.Blue("invalid request, no house 0"));
  }

  // Query asset balances
  else if(source != 0 && value == 0 && destination == 0) {
    console.log(tynt.Blue("console log: Query function (serial.js)"))
    resObj = {
      "firstName": "admin",
      "idtok": "idtok" + source,
      "iden": "iden" + source,
      "idcash": "idcash" + source,
      "idres": "idres" + source,
      "function": "query"
    }
    
    socket.onopen = function() { 
      socket.send(JSON.stringify(resObj));
    }

  }
  // Consume function


  // Produce function
  else if(source != 0 && value != 0 && destination == 0) {
    console.log(tynt.Blue("console log: Produce function (serial.js)"))
    resObj = {
      "owner": "House" + source, // sets the owner of the asset to "House #". This is just for clarity and has no effect on network
      "ownerType": "Resident",
      "iden": "iden" + source,
      "value": value,
      "idres": "idres" + source,
      "function": "produce",
      "source": source
    }    
    socket.onopen = function() { 
      socket.send(JSON.stringify(resObj));
    }
  }


  else {
    console.log(tynt.Blue("console log: Consume function (serial.js)"))
    resObj = {
      "owner": "House" + source, // sets the owner of the asset to "House #". This is just for clarity and has no effect on network
      "ownerType": "Resident",
      "iden": "iden" + source,
      "value": value,
      "idres": "idres" + source,
      "function": "consume",
      "source": source
    }    
    socket.onopen = function() { 
      socket.send(JSON.stringify(resObj));
    }
  }

  

  // Send transaction request data to the Websocket Server
  socket.onmessage = function(e) {
  console.log('Transaction Result: ' + e.data + '\n');
  port.write(e.data + '\n');
};

  // Trigger event for new data requests received on the serial port
  emitter.emit('newTransactionRequest');
});
