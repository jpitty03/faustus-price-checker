// DEPENDENCIES
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// CONFIGURATION / MIDDLEWARE
require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ API ROUTES COME FIRST
const pricesController = require('./controllers/prices_controller');
app.use('/api/prices', pricesController);

// ✅ Serve Static Files AFTER API routes
app.use(express.static(path.join(__dirname, '../build')));

// ✅ Catch-All Route for React AFTER API Routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

// LISTEN
const PORT = process.env.NODE_PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
