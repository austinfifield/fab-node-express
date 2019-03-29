/*
    This script:
    - Runs a WebSocket Server on http://localhost:3000
    - Takes incoming transaction request data sent from the client (serial.js)
    - Should query account balances from blockchain and produce transaction result arrays
    - Sends transaction result data back to client
*/

/*
    Functionality still needed:
    - Integration of getting account balances from blockchain, performing logic, and invoking blockchain
    to generate the transaction result data (the beef of the SDK)
    - It should not only send transaction result data back to the requesting client,
    but also to every udoo. This ensures energy sellers get their account balances updated on LCD
    - Without this functionality, seller account balances won't update on LCD until THEY request a new transaction (not good)
*/

const axios = require('axios');
const WebSocket = require('ws');
const server = require('http').createServer();
const app = require("../../app");
const spawn = require("child_process").spawn;
const wss = new WebSocket.Server({
    server: server
});

server.on('request', app);


// When server receives incoming data, print the data in terminal and send back the transaction result
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {

        obj = JSON.parse(message)

        if(obj.function == "query"){
        axios.post('http://localhost:3000/assets', {
            
                firstName: "admin",
                idtok: obj.idtok,
                iden: obj.iden,
                idcash: obj.idcash,
                idres: obj.idres

        }).then(res => {          
            ws.send(JSON.stringify(res.data))
        })
        .catch(err => {
            console.log(err)
        })
    }
    else if(obj.function == "produce"){
        axios.post('http://localhost:3000/produce', {
            owner: obj.owner,
            ownerType: obj.ownerType,
            iden: obj.iden,
            value: obj.value,
            idres: obj.idres
        }).then(res => {
            ws.send(JSON.stringify(ownder + " " + res))
        }).catch(err => {
            console.log(err)
        })
    }
        // In here is where the SDK should generate the transaction result before sending it
        // For now, this is just sending back a dummy transaction result
        
        



        });    
});

server.listen(3000, function() {
    console.log('listening to port 3000');
})