import requests
import json
import sys

firstName = sys.argv[1]
lastName = sys.argv[2]
alias = sys.argv[3]
password = sys.argv[4]
tokens = sys.argv[5]
id = sys.argv[6]
type = sys.argv[7]
cash = sys.argv[8]
energy = sys.argv[9]


resObj = {
    "firstName": firstName,
    "lastName": lastName,
    "alias": alias,
    "password": password,
    "tokens": tokens,
    "id": id,
    "type": type,
    "cash": cash,
    "energy": energy
}

post = requests.post("http://localhost:3000/users/", json=resObj)

print(post.text)