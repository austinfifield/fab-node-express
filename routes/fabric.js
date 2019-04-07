var express = require('express');
var router = express.Router();
let data = require('../src/udoo/getData')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
  
  obj = JSON.stringify(req.body)
  console.log(req.body)
})

module.exports = router;
