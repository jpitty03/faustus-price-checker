const prices = require('express').Router()
const db = require('../models')
const { Prices } = db

// GET ALL PRICES
prices.get('/', async (req, res) => {
    try {
        console.log("GET ALL PRICES")
        const foundPrices = await Prices.findAll({
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
              "want_currency_icon"
            ],
            raw: true,
            logging: console.log
          });
        console.log("foundPrices", foundPrices)
        res.status(200).json(foundPrices)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
})

module.exports = prices