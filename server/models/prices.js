'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Prices.init({
    created_at: DataTypes.DATE,
    have_currency: DataTypes.TEXT,
    have_amount: DataTypes.REAL,
    want_currency: DataTypes.TEXT,
    want_amount: DataTypes.REAL,
    trade_type: DataTypes.TEXT,
    stock: DataTypes.INTEGER,
    ninja_price: DataTypes.REAL,
    last_updated: DataTypes.DATE,
    have_currency_icon: DataTypes.TEXT,
    want_currency_icon: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Prices',
    tableName: 'prices',
    timestamps: false,
    underscored: true 
  });
  return Prices;
};