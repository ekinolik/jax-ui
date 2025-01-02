require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { useJaxClient } = require('@ekinolik/jax-react-client');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Get absolute paths for certificates
const certPath = path.join(__dirname, '../../certs');
const clientCertPath = path.join(certPath, 'client.crt');
const clientKeyPath = path.join(certPath, 'client.key');
const caCertPath = path.join(certPath, 'ca.crt');

console.log('Loading certificates from:', {
  clientCertPath,
  clientKeyPath,
  caCertPath
});

// Initialize the JAX client
const config = {
  host: process.env.JAX_HOST || 'localhost:50051',
  debug: true,
  useTLS: true,
  certPaths: {
    cert: clientCertPath,
    key: clientKeyPath,
    ca: caCertPath
  }
};

console.log('Initializing JAX client with config:', {
  ...config,
  certPaths: '<redacted>'
});

const jaxClient = useJaxClient(config);

console.log('JAX client initialized');

// Endpoint to get DEX data
app.get('/api/dex', async (req, res) => {
  try {
    const { underlyingAsset, numStrikes } = req.query;
    
    const response = await jaxClient.getDexByStrikes({
      underlyingAsset: underlyingAsset || 'SPY',
      numStrikes: numStrikes ? parseInt(numStrikes) : 50
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching DEX data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get GEX data
app.get('/api/gex', async (req, res) => {
  try {
    const { underlyingAsset, numStrikes } = req.query;
    
    const response = await jaxClient.getGexByStrikes({
      underlyingAsset: underlyingAsset || 'SPY',
      numStrikes: numStrikes ? parseInt(numStrikes) : 50
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching GEX data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get last trade price
app.get('/api/market/last-price', async (req, res) => {
  try {
    const { symbol } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const response = await jaxClient.getLastTrade({
      ticker: symbol
    });

    // Transform the response to include the price field
    const transformedResponse = {
      price: Number(response?.u?.[0]),  // Price is first element in u array
      timestamp: Number(response?.u?.[2]),  // Timestamp is third element
      symbol: symbol
    };

    if (typeof transformedResponse.price !== 'number' || isNaN(transformedResponse.price)) {
      console.error('Invalid price in response:', response);
      return res.status(500).json({ error: 'Invalid price data received' });
    }

    res.json(transformedResponse);
  } catch (error) {
    console.error('Detailed error in last trade price endpoint:', {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack
    });
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      details: error.details 
    });
  }
});

const PORT = process.env.PROXY_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 