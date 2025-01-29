'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE
      },
      have_currency: {
        type: Sequelize.TEXT
      },
      have_amount: {
        type: Sequelize.REAL
      },
      want_currency: {
        type: Sequelize.TEXT
      },
      want_amount: {
        type: Sequelize.REAL
      },
      trade_type: {
        type: Sequelize.TEXT
      },
      stock: {
        type: Sequelize.INTEGER
      },
      ninja_price: {
        type: Sequelize.REAL
      },
      last_updated: {
        type: Sequelize.DATE
      },
      have_currency_icon: {
        type: Sequelize.TEXT
      },
      want_currency_icon: {
        type: Sequelize.TEXT
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('prices');
  }
};