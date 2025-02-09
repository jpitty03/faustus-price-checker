const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const WebSocket = require('ws');
const { Client } = require('pg');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🔹 Serve React frontend (for Render deployment)
app.use(express.static(path.join(__dirname, '../build')));

// 🔹 WebSocket Setup
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('✅ WebSocket client connected');

  ws.on('close', () => console.log('❌ WebSocket client disconnected'));
});

// 🔹 Upgrade HTTP server to WebSocket
const server = app.listen(process.env.NODE_PORT || 5001, () => {
  console.log(`🚀 Server running on port ${process.env.NODE_PORT || 5001}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// 🔹 Controllers (API Endpoints)
const pricesController = require('./controllers/prices_controller');
app.use('/api/prices', pricesController);

// 🔹 Serve React frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

/**
 * 🔥 PostgreSQL LISTEN/NOTIFY for DB updates
 */
let pgClient;
const connectToDatabase = async () => {
  try {
    pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await pgClient.connect();
    console.log('✅ Connected to PostgreSQL LISTEN for changes...');

    pgClient.query('LISTEN prices_update');

    pgClient.on('notification', async (msg) => {
      console.log('📡 Database change detected:', msg.payload);

      // Fetch latest prices
      const { Prices } = require('./models');
      const updatedPrices = await Prices.findAll({
        attributes: [
          'id',
          'created_at',
          'have_currency',
          'have_amount',
          'want_currency',
          'want_amount',
          'trade_type',
          'stock',
          'ninja_price',
          'last_updated',
          'have_currency_icon',
          'want_currency_icon',
          'want_item_type'
        ],
        raw: true
      });

      console.log('📡 Broadcasting WebSocket update:', updatedPrices);

      // Send update to all WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(updatedPrices));
        }
      });
    });

    pgClient.on('error', (err) => {
      console.error('❌ PostgreSQL error:', err);
      console.log('🔄 Reconnecting to database in 5 seconds...');
      setTimeout(connectToDatabase, 5000);
    });
  } catch (error) {
    console.error('❌ Error connecting to PostgreSQL:', error);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectToDatabase, 5000);
  }
};

// Start database connection
connectToDatabase();
