const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events');
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
    console.log(tynt.Blue('Data received on serial port: ' + data));
    let transactionRequest = data.split(' ');
    console.log(typeof(transactionRequest[0]));
    console.log(typeof(transactionRequest[1]));
    console.log(typeof(transactionRequest[2]));

    let source = parseInt(transactionRequest[0]);
    let value = parseInt(transactionRequest[1]);
    let destination = parseInt(transactionRequest[2]);

    console.log(typeof(source));
    console.log(typeof(value));
    console.log(typeof(destination));
 
  // Send transaction request data to the Websocket Server
  socket.onmessage = function(e) {
  console.log('Transaction Result: ' + e.data + '\n');
  port.write(e.data + '\n');
  }

  // Trigger event for new data requests received on the serial port
  emitter.emit('newTransactionRequest');
  
});

module.exports = {
  getData: function(data) {
      console.log("from serial.js: " + data);
    //   dataObj = JSON.parse(data);

    //   console.log(dataObj.source + " " + dataObj.value + " 0")
    //   port.write(dataObj.source + " " + dataObj.value + " 0" + '\n');
  }
}