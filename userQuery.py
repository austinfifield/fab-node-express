import requests
import json
import sys

firstName = sys.argv[1]
id = sys.argv[2]

resObj = {
    "firstName": firstName,
    "id": id
}

get = requests.get("http://localhost:3000/user/", json=resObj)
print(get.text)


