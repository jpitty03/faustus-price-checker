"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("prices", [
      {
        created_at: "2025-01-29T22:13:35.000Z",
        have_currency: "Chaos Orb",
        have_amount: 1,
        want_currency: "Divine Orb",
        want_amount: 1,
        trade_type: "offer",
        stock: 156,
        ninja_price: 170,
        last_updated: "2025-01-29T22:13:35.000Z",
        have_currency_icon: "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png",
        want_currency_icon: "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyDivine.png"
      },
      {
        created_at: "2025-01-29T22:13:35.000Z",
        have_currency: "Chaos Orb",
        have_amount: 33,
        want_currency: "Exalted Orb",
        want_amount: 1,
        trade_type: "offer",
        stock: 89,
        ninja_price: 40,
        last_updated: "2025-01-29T22:13:35.000Z",
        have_currency_icon: "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png",
        want_currency_icon: "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyDivine.png"
      },
      {
        created_at: "2025-01-29T22:13:35.000Z",
        have_currency: "Divine Orb",
        have_amount: 1.2,
        want_currency: "Orb of Alchemy",
        want_amount: 1.6,
        trade_type: "offer",
        stock: 77,
        ninja_price: .0198,
        last_updated: "2025-01-29T22:13:35.000Z",
        have_currency_icon: "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png",
        want_currency_icon: "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyDivine.png"
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("prices", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
