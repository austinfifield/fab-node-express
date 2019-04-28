/*
fabric.js - This route/endpoint will recieve the updated balance via POST request and then pass it along to the serial.js file.
*/

var express = require('express');
var router = express.Router();
// Function imported to pass data from this endpoint to serial.js
let data = require('../src/udoo/serial.js').getData;

// GET request, currently useless.
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// POST request
router.post('/', function(req, res, next) {
  obj = JSON.stringify(req.body)
  console.log("Fabric route")
  
  // Sends the balance information to serial.js
  data(obj);
  res.send("success");
})

module.exports = router;
