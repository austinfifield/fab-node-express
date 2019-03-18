import requests
import json
import sys

source = sys.argv[1]
sourceID = sys.argv[2]
destination = sys.argv[3]
destinationID = sys.argv[4]
energyAmount = sys.argv[5]

resObj = {
    "source": source,
    "sourceID": sourceID,
    "destination": destination,
    "destinationID": destinationID,
    "energyAmount": energyAmount
}

post = requests.post("http://localhost:3000/transactions/", json=resObj)
print(post.text)


