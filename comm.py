import requests
import json
import sys

source = sys.argv[1]
value = sys.argv[2]
destination = sys.argv[3]
resObj = {}


# if source == 0
# invalid argument
if source == '0' and value == '0' and destination == '0':
    print("invalid arguments")

elif source == '0':
    print("invalid arguments")


# if destination == 0
# consume energy
# update current houses energy to energy - N
#------UNDER CONSTRUCTION----------
elif source != '0' and value != '0' and destination == '0':
    print("Consume Energy House #" + source)
    # resObj = {
    #     "tokenInc": "idtok" + source,
    #     "energyInc": "iden" + destination,
    #     "rate": "1",
    #     "energyDec" : "iden" + source,
    #     "value": value,
    #     "tokenDec": "idtok" + destination,
    #     "timestamp": "null"
    # }
    # post = requests.post("http://localhost:3000/consume/", json=resObj)


# if source == destination
# produce energy
# update current house energy to energy + N
#------UNDER CONSTRUCTION----------
elif source == destination and value != '0' and source != '0':
    print("Produce Energy House #" + source)
    # resObj = {
    #     "tokenInc": "idtok" + source,
    #     "energyInc": "iden" + destination,
    #     "rate": "1",
    #     "energyDec" : "iden" + source,
    #     "value": value,
    #     "tokenDec": "idtok" + destination,
    #     "timestamp": "null"
    # }
    # post = requests.post("http://localhost:3000/produce/", json=resObj)

# if source != destination && destination != 0
# trade energy
elif source != destination and destination != '0' and source != '0' and value != '0':
    print("Energy Trade House #" + source + " and House #" + destination)
    resObj = {
        "tokenInc": "idtok" + source,
        "energyInc": "iden" + destination,
        "rate": "1",
        "energyDec" : "iden" + source,
        "value": value,
        "tokenDec": "idtok" + destination,
        "timestamp": "null"
    }
    post = requests.post("http://localhost:3000/trade/", json=resObj)
    print(post.text)

    
# Query token house# 0 0
elif source != '0' and value == '0' and destination == '0':
    print("Getting account balance for House #" + source)
    resObj = {
    "firstName": "admin",
    "idtok": "idtok" + source,
    "iden": "iden" + source
    }
    get = requests.get("http://localhost:3000/user/", json=resObj)
    print(get.text)

else:
    print("Nothing")




