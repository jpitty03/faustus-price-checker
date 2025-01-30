const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const path = require("path");
const cors = require("cors");
const WebSocket = require("ws");
const { Client } = require("pg"); // PostgreSQL client for LISTEN/NOTIFY

require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
  });
});

// Upgrade HTTP server to WebSocket
const server = app.listen(process.env.NODE_PORT || 5001, () => {
  console.log(`🚀 Server running on port ${process.env.NODE_PORT || 5001}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Make WebSocket accessible in controllers
module.exports = { app, wss };

// Controllers
const pricesController = require("./controllers/prices_controller");
app.use("/api/prices", pricesController);

/** 
 * 🔥 NEW: Listen for DB Changes using PostgreSQL NOTIFY 
 */

// Connect to PostgreSQL to listen for updates
const pgClient = new Client({
  connectionString: process.env.DATABASE_URL, // Use your DB connection string
  ssl: { rejectUnauthorized: false },
});

pgClient.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL LISTEN for changes...");
    pgClient.query("LISTEN prices_update"); // Listen for DB changes
  })
  .catch((err) => console.error("❌ Error connecting to PostgreSQL LISTEN:", err));

// Handle PostgreSQL NOTIFY events
pgClient.on("notification", async (msg) => {
  console.log("📡 Database change detected:", msg.payload);

  // Fetch latest prices
  const { Prices } = require("./models");
  const updatedPrices = await Prices.findAll({
    attributes: [
      "id",
      "created_at",
      "have_currency",
      "have_amount",
      "want_currency",
      "want_amount",
      "trade_type",
      "stock",
      "ninja_price",
      "last_updated",
      "have_currency_icon",
      "want_currency_icon",
    ],
    raw: true,
  });

  console.log("📡 Broadcasting WebSocket update:", updatedPrices);

  // Send update to all WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(updatedPrices));
    }
  });
});



