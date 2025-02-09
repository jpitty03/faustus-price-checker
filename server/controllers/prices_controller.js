const prices = require('express').Router();
const db = require('../models');
const { Prices } = db;
const { wss } = require('../server'); // Import WebSocket server

// Function to broadcast price updates
const broadcastUpdate = async () => {
  try {
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

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        console.log('✅ Sending WebSocket update to client...');
        client.send(JSON.stringify(updatedPrices));
      }
    });
  } catch (err) {
    console.error('❌ Error broadcasting WebSocket updates:', err);
  }
};

// GET ALL PRICES
prices.get('/', async (req, res) => {
  try {
    console.log('GET ALL PRICES');
    const foundPrices = await Prices.findAll({
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
    res.status(200).json(foundPrices);
  } catch (err) {
    res.status(500).send('Server error');
    console.log(err);
  }
});

// POST NEW PRICE & BROADCAST UPDATE
prices.post('/', async (req, res) => {
  try {
    const newPrice = await Prices.create(req.body);
    console.log('✅ New price added:', newPrice);
    broadcastUpdate(); // Notify WebSocket clients
    res.status(201).json(newPrice);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// UPDATE PRICE & BROADCAST UPDATE
prices.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPrice = await Prices.update(req.body, {
      where: { id },
      returning: true
    });

    if (!updatedPrice[0]) {
      return res.status(404).send('Price not found');
    }

    console.log('✅ Updated price:', updatedPrice[1]);
    broadcastUpdate(); // Notify WebSocket clients
    res.status(200).json(updatedPrice[1]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE PRICE & BROADCAST UPDATE
prices.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Prices.destroy({ where: { id } });

    if (!deletedCount) {
      return res.status(404).send('Price not found');
    }

    console.log('✅ Deleted price ID:', id);
    broadcastUpdate(); // Notify WebSocket clients
    res.status(200).send(`Deleted price ID: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = prices;


