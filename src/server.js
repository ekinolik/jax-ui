require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { useJaxClient } = require('@ekinolik/jax-react-client');

const app = express();

// Configure Express
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Payload too large' });
  }
  if (err.status === 431) {
    return res.status(431).json({ error: 'Request header fields too large' });
  }
  res.status(500).json({ error: 'Internal server error' });
});

// Serve static files
const buildPath = path.resolve(process.cwd(), 'build');
console.log('Serving static files from:', buildPath);
app.use(express.static(buildPath));

// Get paths for certificates relative to current working directory
const certPath = './certs';
const clientCertPath = path.join(certPath, 'client.crt');
const clientKeyPath = path.join(certPath, 'client.key');
const caCertPath = path.join(certPath, 'ca.crt');

// Initialize the JAX client
const config = {
  host: process.env.JAX_HOST || 'localhost:50051',
  debug: process.env.NODE_ENV === 'development',
  useTLS: true,
  certPaths: {
    cert: clientCertPath,
    key: clientKeyPath,
    ca: caCertPath
  }
};

let jaxClient;
try {
  jaxClient = useJaxClient(config);
  console.log('JAX client initialized successfully');
} catch (error) {
  console.error('Failed to initialize JAX client:', error);
  process.exit(1);
}

// API endpoints
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

app.get('/api/market/last-price', async (req, res) => {
  try {
    const { symbol } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }

    const response = await jaxClient.getLastTrade({
      ticker: symbol
    });

    const transformedResponse = {
      price: Number(response?.u?.[0]),
      timestamp: Number(response?.u?.[2]),
      symbol: symbol
    };

    if (typeof transformedResponse.price !== 'number' || isNaN(transformedResponse.price)) {
      console.error('Invalid price in response:', response);
      return res.status(500).json({ error: 'Invalid price data received' });
    }

    res.json(transformedResponse);
  } catch (error) {
    console.error('Error in last trade price endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(process.cwd(), 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 