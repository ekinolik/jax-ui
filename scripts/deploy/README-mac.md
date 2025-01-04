# JAX UI Deployment (Mac ARM)

## Prerequisites

Before starting the application, ensure you have:

1. The required certificates in the `certs` directory:
   - `certs/client.crt`
   - `certs/client.key`
   - `certs/ca.crt`

## Setup

1. Copy `.env.example` to `.env` and adjust the values for your environment
2. Place your certificates in the `certs` directory
3. Run `./start.sh` to start the application

## Configuration

The following environment variables can be set in `.env`:
- `PORT`: The port for the UI server (default: 3000)
- `PROXY_PORT`: The port for the proxy server (default: 3001)
- `JAX_HOST`: The JAX service host (default: localhost:50051)
- Other JAX-specific configuration options

Note: This package contains the proxy server executable for Mac ARM (Apple Silicon). 