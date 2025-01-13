#!/bin/bash

# Create certs directory if it doesn't exist
mkdir -p certs

# Create config file for OpenSSL
cat > certs/openssl.cnf << EOL
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = CA
L = San Francisco
O = Development
CN = localhost

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOL

# Generate UI private key and certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout certs/ui.key -out certs/ui.crt \
  -config certs/openssl.cnf

# Clean up config
rm certs/openssl.cnf

# Set permissions
chmod 600 certs/ui.key
chmod 644 certs/ui.crt

echo "UI HTTPS certificates generated successfully in ./certs directory" 