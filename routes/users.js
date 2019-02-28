let express = require('express');
let router = express.Router();
const constants = require('../src/constants');
let resident = require('../src/CC/residents');

let resObj = {}

// router.post("/", (req, res) => {
//     let newResident = req.body;
//     console.log(newResident);

//     resident.addTo(newResident);

//     res.send(newResident);
// });

router.post("/", (req, res) => {

    resident.query(req.body);
    

    res.status(200).json(data);
});

module.exports = router;
