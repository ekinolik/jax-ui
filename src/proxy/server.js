require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { useJaxClient } = require('@ekinolik/jax-react-client');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the JAX client
const jaxClient = useJaxClient({
  host: process.env.JAX_HOST || 'localhost:50051',
  debug: true
});

// Endpoint to get DEX data
app.get('/api/dex', async (req, res) => {
  try {
    const { underlyingAsset, startStrikePrice, endStrikePrice } = req.query;
    
    const response = await jaxClient.getDex({
      underlyingAsset: underlyingAsset || 'SPY',
      startStrikePrice: startStrikePrice ? parseInt(startStrikePrice) : 0,
      endStrikePrice: endStrikePrice ? parseInt(endStrikePrice) : 50
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching DEX data:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PROXY_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 