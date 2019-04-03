var express = require('express');
var router = express.Router();
let shelljs = require('shelljs')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
  
  obj = JSON.stringify(req.body)
  console.log(req.body)
  shelljs.exec("../python3 invoke.py 1 0 0")
})

module.exports = router;
