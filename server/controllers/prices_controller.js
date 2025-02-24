const prices = require('express').Router();
const db = require('../models');
const { Prices, sequelize } = db;
const { Op } = require('sequelize');
const { wss } = require('../server'); // Import WebSocket server

// 🔹 Common attributes for all queries
const PRICE_ATTRIBUTES = [
  'id', 'created_at', 'have_currency', 'have_amount', 'want_currency',
  'want_amount', 'trade_type', 'stock', 'ninja_price', 'last_updated',
  'have_currency_icon', 'want_currency_icon', 'want_item_type'
];

// 🔹 WebSocket Broadcast Function
const broadcastUpdate = async () => {
  try {
    const updatedPrices = await Prices.findAll({ attributes: PRICE_ATTRIBUTES, raw: true });

    console.log('📡 Broadcasting WebSocket update...');
    wss.clients.forEach(client => {
      if (client.readyState === 1) { client.send(JSON.stringify(updatedPrices)); }
    });
  } catch (err) {
    console.error('❌ WebSocket Broadcast Error:', err);
  }
};

// 🔹 GET ALL PRICES (Supports Arbitrage Calculation)
prices.get('/', async (req, res) => {
  try {
    console.log('📡 GET ALL PRICES');
    const attributes = [...PRICE_ATTRIBUTES];
    const oneHourAgo = new Date(Date.now() - (60 * 60 * 1000));

    // Find all prices updated within the last hour
    const foundPrices = await Prices.findAll({
      where: {
        last_updated: {
          [Op.gte]: oneHourAgo
        }
      },
      attributes,
      raw: true
    });

    res.status(200).json(foundPrices);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 🔹 POST NEW PRICE & BROADCAST UPDATE
prices.post('/', async (req, res) => {
  try {
    const newPrice = await Prices.create(req.body);
    console.log('✅ New price added:', newPrice);
    broadcastUpdate();
    res.status(201).json(newPrice);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 🔹 UPDATE PRICE & BROADCAST UPDATE
prices.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedCount, updatedPrices] = await Prices.update(req.body, {
      where: { id },
      returning: true
    });

    if (!updatedCount) { return res.status(404).send('Price not found'); }

    console.log('✅ Updated price:', updatedPrices[0]);
    broadcastUpdate();
    res.status(200).json(updatedPrices[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 🔹 DELETE PRICE & BROADCAST UPDATE
prices.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Prices.destroy({ where: { id } });

    if (!deletedCount) { return res.status(404).send('Price not found'); }

    console.log('✅ Deleted price ID:', id);
    broadcastUpdate();
    res.status(200).send(`Deleted price ID: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 🔹 SORTED PRICE LIST (With Arbitrage Calculation if Needed)
prices.get('/sort', async (req, res) => {
  try {
    const { field, sort, divinePrice } = req.query;
    const orderDirection = sort?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const attributes = [...PRICE_ATTRIBUTES];
    const oneHourAgo = new Date(Date.now() - (60 * 60 * 1000));

    // If sorting by arbitrage, include calculation
    if (field === 'arbitrage' && divinePrice) {
      const divinePriceNum = parseFloat(divinePrice);
      attributes.push([
        sequelize.literal(`
          (
            CASE 
              WHEN want_currency = 'Chaos Orb' THEN want_amount * 1
              WHEN want_currency = 'Divine Orb' THEN want_amount * ${divinePriceNum}
              ELSE want_amount * ninja_price
            END
          )
          -
          (
            CASE 
              WHEN have_currency = 'Chaos Orb' THEN have_amount * 1
              WHEN have_currency = 'Divine Orb' THEN have_amount * ${divinePriceNum}
              ELSE have_amount * ninja_price
            END
          )
        `),
        'arbitrage'
      ]);
    }

    const order = field ? [[sequelize.literal(field), orderDirection]] : [];

    const sortedPrices = await Prices.findAll({
      where: {
        last_updated: {
          [Op.gte]: oneHourAgo
        }
      },
      attributes,
      order,
      raw: true
    });

    res.status(200).json(sortedPrices);
  } catch (err) {
    console.error('Error in sorting:', err);
    res.status(500).send('Server error');
  }
});

module.exports = prices;
