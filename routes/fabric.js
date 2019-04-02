var express = require('express');
var router = express.Router();
let serial = require('../src/udoo/socket_testing').newData
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
  console.log(req.body);
  if(req.body != null){
    serial.newData(req.body)
  }
})

module.exports = router;
