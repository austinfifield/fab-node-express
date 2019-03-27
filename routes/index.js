var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  let obj = req.body

  res.render('index',{
    title: 'Account Balances',
    balances: {
      energy: obj.energy,
      token: obj.token,
      cash: obj
    },
    
    Residents: {
      one: "House 1",
      two: "House 2",
      three: "House 3",
      four: "House 4",
      five: "House 5",
      six: "House 6"
    }
  
  });

});

module.exports = router;
