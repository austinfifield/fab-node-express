# Hyperledger Fabric Network

### Prereq's
clone Huy's network
```
git clone https://github.com/httran13/fabric-network
```
follow his readme

### Node SDK (above network must be up)
### must use nodejs version 8.9.0
```
nvm use 8.9.0 
npm run test
```
### should pass the three tests

### open second terminal to feed data from comm.py
```
python3 comm.py arg1 arg2 arg3
```
  
  arg1 is the 'source' or 'seller'
  arg2 is the value/amount of energy being traded/consumed/produced
  arg3 is the 'destination' or 'buyer'
  
* if arg1 == arg3 then the house will produce energy from itself
* if arg3 == 0 then the source will cconsume energy
* if arg1 != arg3 and arg2 != 0 then the seller will transfer N energy to the buyer

### to query balances (House 1 for example)
```
python3 comm.py 1 0 0
```

### to trade energy (House 1 sells 10 energy to House 2)
```
python3 comm.py 1 10 2
```

### to consume energy (House 1 consumes 10 energy)
```
python3 comm.py 1 10 0
```
### to produce energy (House 1 produces 10 energy)
```
python3 comm.py 1 10 1
```
