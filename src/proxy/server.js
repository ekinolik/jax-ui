require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { useJaxClient } = require('@ekinolik/jax-react-client');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the JAX client
console.log('Initializing JAX client with config:', {
  host: process.env.JAX_HOST || 'localhost:50051',
  debug: true
});

const jaxClient = useJaxClient({
  host: process.env.JAX_HOST || 'localhost:50051',
  debug: true
});

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
      price: response.price || response.lastPrice || response.last_price || response.value,
      timestamp: response.timestamp,
      symbol: response.symbol || symbol
    };

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