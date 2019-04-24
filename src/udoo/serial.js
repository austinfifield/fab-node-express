const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events');
const tynt = require('tynt')
const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));
const emitter = new EventEmitter();
const axios = require('axios');


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

    let source = parseInt(transactionRequest[0]);
    let value = parseInt(transactionRequest[1]);
    let destination = parseInt(transactionRequest[2]);
 
    if(source != 0 && value == 0 && destination == 0) {
        axios.post('http://localhost:3000/assets', {
            iden: "iden" + source,
            idres: "idres" + source

        }).then(res => {
            console.log('Transaction Result: ' + e.data + '\n');
            port.write(e.data + '\n');
            
            
        })
        .catch(err => {
            console.log(err)
        })
    }

//   console.log('Transaction Result: ' + e.data + '\n');
//   port.write(e.data + '\n');
  

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