/* 
    This is a test script for WebSocket functionality development
    You can ignore it, it will be thrown away
*/

const WebSocket = require('ws')
let socket;


// Serial stream comming in...
// The serial data recieved is...
let transactionRequest = ['1', '0', '0'];
var serialObj = {
    "source": transactionRequest[0],
    "value": transactionRequest[1],
    "destination": transactionRequest[2]
}


if(serialObj.source == '0') {
    console.log("invalid request");
} 

else if(serialObj.source != '0' && serialObj.value == '0' && serialObj.destination == '0') {
    socket = new WebSocket('ws://localhost:3000/');
    //console.log("Query")
    resObj = {
        "firstName": "admin",
        "idtok": "idtok" + serialObj.source,
        "iden": "iden" + serialObj.source,
        "idcash": "idcash" + serialObj.source,
        "idres": "idres" + serialObj.source
    }

    

    socket.onopen = function() {
        socket.send(JSON.stringify(resObj));
    };
    
    socket.onmessage = function(e) {
        console.log('Transaction Result: ' + e.data);
    };
}




