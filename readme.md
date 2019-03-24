# Hyperledger Fabric Network

### Prereq's
clone Huy's network
```
git clone https://github.com/httran13/fabric-network
```
follow his readme

### Node SDK (above network must be up)
### Must use nodejs version *8.9.0*
```
nvm use 8.9.0 
npm run test
```
### should pass the three tests

### Start server
```
npm run dev
```
### open second terminal to feed data from invoke.py, getTransactions.py, createUser.py, createAssets.py
## If fresh network (No residents or assets have been created)
### You will need to create residents through the SDK
```
python3 createUser.py arg1
```
* where arg1 is a number (1-N) of House

### You will need to create assets (through ./fabric.sh inside /fabric-network/networkup/docker, or through SDK)
```
python3 createAssets.py arg1 arg2 arg3 arg4
```
* where arg1 is the House id ('House 1', 'House 2', etc)
* where arg2 is the token value
* where arg3 is energy value
* where arg4 is cash value

```
python3 invoke.py arg1 arg2 arg3
```
##### arg1 is the 'source' or 'seller'
##### arg2 is the value/amount of energy being traded/consumed/produced
##### arg3 is the 'destination' or 'buyer'
  
* if arg1 == arg3 then the house will produce energy from itself
* if arg3 == 0 then the source will cconsume energy
* if arg1 != arg3 and arg2 != 0 then the seller will transfer N energy to the buyer

### to query balances (House 1 for example)
```
python3 invoke.py 1 0 0
```

### to trade energy (House 1 sells 10 energy to House 2)
```
python3 invoke.py 1 10 2
```

### to consume energy (House 1 consumes 10 energy)
```
python3 invoke.py 1 10 0
```
### to produce energy (House 1 produces 10 energy)
```
python3 invoke.py 1 10 1
```
