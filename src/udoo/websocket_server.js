const axios = require('axios');
const tynt = require('tynt');
let serialModule = require('./serial');




    function getSerialData(data) {
        serialObj = JSON.parse(data);
        console.log("Data from serial port " + JSON.stringify(serialObj, null, 4));
        let source = parseInt(serialObj.source);
        let value = parseInt(serialObj.value);
        let destination = parseInt(serialObj.destination);
                // QUERY
                if(source != 0 && value == 0 && destination == 0){
                    console.log(tynt.Green("console log: QUERY FUNCTION (from websocket_server.js"))
                    axios.post('http://localhost:3000/assets', {
                        iden: "iden" + source,
                        idres: "idres" + source
        
                    }).then(res => {
                        console.log(res.data);
                        
                        
                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }
        
                // PRODUCE
                else if(source != 0 && value >= 0 && destination == 0){
                    console.log(tynt.Green("console log: PRODUCE FUNCTION (from websocket_server.js"))
                    // axios.post('http://localhost:3000/produce', {
                    //     owner: obj.owner,
                    //     ownerType: obj.ownerType,
                    //     iden: obj.iden,
                    //     value: obj.value,
                    //     idres: obj.idres
                    // }).then(res => {
                    //     ws.send(parseInt(obj.source) + " " + parseInt(res.data) + " " + 0)
                    // }).catch(err => {
                    //     console.log(err)
                    // })
                }
        
                // CONSUME
                else if (source != 0 && value >= 0 && destination == source){
                    console.log(tynt.Green("console log: CONSUME FUNCTION (from websocket_server.js)"))
                    // let house = obj.source;
                    // axios.post('http://localhost:3000/consume', {
                    //     owner: obj.owner,
                    //     ownerType: obj.ownerType,
                    //     iden: obj.iden,
                    //     value: obj.value,
                    //     idres: obj.idres
                    // }).then(res => {
                    //     // send amount consumed
                    //     ws.send(parseInt(house) + " " + parseInt(res.data.consumed) + " " + parseInt(house))
                    //     // send new balance
                    //     ws.send(parseInt(house) + " " + parseInt(res.data.newBalance) + " " + 0)
                        
        
                    // })
                    // .catch(err => {
                    //     console.log(err)
                    // })
                }
        
                // TRADE
                else if(source != 0 && value > 0 && destination != source && destination != 0) {
                    console.log(tynt.Green("console log: TRADE FUNCTION (from websocket_server.js)"))
                    // axios.post('http://localhost:3000/trade', {
                        
                    //     "tokenInc": obj.tokenInc,
                    //     "energyInc": obj.energyInc,
                    //     "rate": "1",
                    //     "energyDec" : obj.energyDec,
                    //     "value": obj.value,
                    //     "tokenDec": obj.tokenDec,
                    //     "function": "trade",
                    //     "timestamp": "2019"
                        
                    // }).then(res => {
                    //     // send amount consumed
                    //     ws.send(parseInt(obj.source) + " " + parseInt(res.data.amountSold) + " " + parseInt(obj.destination))
        
                    //     // send new balance
                    //     ws.send(parseInt(obj.destination) + " " + parseInt(res.data.sellerBalance) + " " + 0)
                        
                    //     switch(parseInt(obj.destination)) {
                    //         case 1: // House 1
                    //             console.log("House 1")
                    //             axios.post('http://192.168.1.101:3000/fabric', {
                    //                 source: parseInt(obj.destination),
                    //                 value: res.data.sellerBalance
                    //             })
                    //             .then(res => {
                    //                 console.log("success")    
                    //             })
                    //             .catch(err => {
                    //                 console.log(err)
                    //             })
                    //             break;
        
                    //         case 2: // House 2
                    //             console.log("House 2")
                    //             axios.post('http://192.168.1.102:3000/fabric', {
                    //                 source: parseInt(obj.destination),
                    //                 value: res.data.sellerBalance
                    //             })
                    //             .then(res => {
                    //                 console.log("success")    
                    //             })
                    //             .catch(err => {
                    //                 console.log(err)
                    //             })
                    //             break;
        
                    //         case 3: 
                    //             console.log("House 3")
                    //             axios.post('http://192.168.1.103:3000/fabric', {
                    //                 source: parseInt(obj.destination),
                    //                 value: res.data.sellerBalance
                    //             })
                    //             .then(res => {
                    //                 console.log("success")    
                    //             })
                    //             .catch(err => {
                    //                 console.log(err)
                    //             })
                    //             break;
        
                    //         case 4: 
                    //             console.log("House 4")
                    //             axios.post('http://192.168.1.104:3000/fabric', {
                    //                 source: parseInt(obj.destination),
                    //                 value: res.data.sellerBalance
                    //             })
                    //             .then(res => {
                    //                 console.log("success")    
                    //             })
                    //             .catch(err => {
                    //                 console.log(err)
                    //             })
                    //             break;
        
                    //         case 5: 
                    //             console.log("House 5")
                    //             axios.post('http://192.168.1.105:3000/fabric', {
                    //                 source: parseInt(obj.destination),
                    //                 value: res.data.sellerBalance
                    //             })
                    //             .then(res => {
                    //                 console.log("success")    
                    //             })
                    //             .catch(err => {
                    //                 console.log(err)
                    //             })
                    //             break;
        
                    //         case 6: 
                    //             console.log("House 6")
                    //             axios.post('http://192.168.1.106:3000/fabric', {
                    //                 source: parseInt(obj.destination),
                    //                 value: res.data.sellerBalance
                    //             })
                    //             .then(res => {
                    //                 console.log("success")    
                    //             })
                    //             .catch(err => {
                    //                 console.log(err)
                    //             })
                    //             break;
                    //         default:
                    //             console.log("NO HOUSE " + obj.destination + "!")
        
                    //     }
                    // })
                    // .catch(err => {
                    //     console.log(err)
                    // })
                }

}

module.exports = {getSerialData}