#!/bin/bash

# Check for certificates
if [ ! -f "certs/client.crt" ] || [ ! -f "certs/client.key" ] || [ ! -f "certs/ca.crt" ]; then
    echo "Error: Missing certificates in certs directory."
    echo "Please ensure the following files exist:"
    echo "  - certs/client.crt"
    echo "  - certs/client.key"
    echo "  - certs/ca.crt"
    exit 1
fi

# Copy environment file if it doesn't exist
[ ! -f .env ] && cp .env.example .env

# Start the proxy server in background using the wrapper
./run-proxy.sh &
PROXY_PID=$!

# Source environment variables for the UI server
source .env

# Serve the static files
REACT_APP_PROXY_URL=http://localhost:${PROXY_PORT:-3001} npx serve -s build -l ${PORT:-3000}

# If UI server exits, kill the proxy
kill $PROXY_PID 