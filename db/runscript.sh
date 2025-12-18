#!/bin/bash

~/Downloads/mongosh-2.5.10-linux-x64/bin/mongosh "mongodb://root:$(cat ./dockersecrets/mongo_root.txt)@localhost:27017/BookStore?authSource=admin" --file script.js
