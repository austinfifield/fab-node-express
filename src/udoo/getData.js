const WebSocket = require('ws')
let socket = new WebSocket('ws://localhost:3000/');
module.exports = {
    getData: function(data) {
        socket.onopen = function() { 
            socket.send(JSON.stringify(data));
          } 
    }
};