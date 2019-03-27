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

const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const emitter = new EventEmitter();
const socket = new WebSocket('ws://localhost:3000/')

port.on("open", () => {
    console.log('Serial port /dev/ttyACM0 is open\n');
  });
  
// Display "New Transaction Request" when new serial data is received
emitter.on('newTransactionRequest', function(){
  console.log('New Transaction Request\n');
});

// Read the serial data on the port
parser.on('data', data =>{
  console.log('Data received on serial port: ', data);



  // Split data string in to an array to print nice stuff in the terminal
  var transactionRequest = data.split(' ');
  if (transactionRequest[2] == 0){
    console.log('Producer: ', transactionRequest[0]);
    console.log('Energy: ', transactionRequest[1]);
  }
  else {
    console.log('Buyer: ', transactionRequest[0]);
    console.log('Energy: ', transactionRequest[1]);
    console.log('Seller: ', transactionRequest[2]);
  }

  //-------------START LOGIC--------------------------

  if(transactionRequest[0] == 0) {
    console.log("invalid request, no house 0");
  }
  else if(transactionRequest[0] != 0 && transactionRequest[1] == 0 && transactionRequest[2] == 0) {
    resObj = {
      "firstName": "admin",
      "idtok": "idtok" + transactionRequest[0],
      "iden": "iden" + transactionRequest[0],
      "idcash": "idcash" + transactionRequest[0],
      "idres": "idres" + transactionRequest[0]
  }
  }

    // Send data to websocket server on localhost:3000
    
    socket.onopen = function() {
  
      
      socket.send(JSON.stringify(resObj));
    };

  // Send transaction request data to the Websocket Server
  socket.onmessage = function(e) {
  console.log('Transaction Result: ' + e.data + '\n');
  port.write(e.data + '\n');
};

  // Trigger event for new data requests received on the serial port
  emitter.emit('newTransactionRequest');
});
