import requests
import json
import sys

alias = sys.argv[1]
id = sys.argv[2]

resObj = {
    "alias": alias,
    "id": id
}

get = requests.get("http://localhost:3000/user/", json=resObj)
print(get.json())


