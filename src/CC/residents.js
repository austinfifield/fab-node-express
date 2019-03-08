let appRoot = require('app-root-path');
let fabService = require(`${appRoot}/src/fabric/fabric-interface`);
let fabUtil = fabService.fabUtil;
const constants = require('../constants');
let user = require('../../routes/users');
let resObj = {}


exports.addTo = function(resident) {

    console.log(resident);

    fabService.makeUser(resident.alias, resident.password)
        resObj = {
            firstName: resident.firstName,
            lastName: resident.lastName,
            alias: resident.alias,
            tokens: resident.tokens,
            id: resident.id,
            type: resident.type,
            cash: resident.cash,
            energy: resident.energy
            };
        
        let args = [resident.id, JSON.stringify(resObj)];

    fabService.invoke(resident.alias, constants.createResident, args)
}

exports.query = function(res) {
    console.log('Query function');
    let resident = res;
    return fabService.query(resident.alias, constants.getResident, [resident.id])
    
}
