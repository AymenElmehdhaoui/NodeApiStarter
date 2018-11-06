#!/bin/bash

echo "Generating self-signed certificates..."
mkdir -p ./dist/config/sslcerts
openssl genrsa -out ./dist/config/sslcerts/key.pem 4096
openssl req -new -key ./dist/config/sslcerts/key.pem -out ./dist/config/sslcerts/csr.pem
openssl x509 -req -days 365 -in ./dist/config/sslcerts/csr.pem -signkey ./dist/config/sslcerts/key.pem -out ./dist/config/sslcerts/cert.pem
rm ./dist/config/sslcerts/csr.pem
chmod 600 ./dist/config/sslcerts/key.pem ./dist/config/sslcerts/cert.pem