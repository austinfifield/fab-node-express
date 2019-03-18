import requests
import json
import sys

source = sys.argv[1]
sourceID = sys.argv[2]
destinationID = sys.argv[3]
energyAmount = sys.argv[4]

resObj = {
    "source": source,
    "sourceID": sourceID,
    "destinationID": destinationID,
    "energyAmount": energyAmount
}

post = requests.post("http://localhost:3000/transactions/", json=resObj)
print(post.text)


