"use strict";
const {
  Model
} = require("sequelize");
const { sequelize } = require(".");
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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  }, {
    sequelize,
    modelName: "Prices",
    tableName: "prices",
    timestamps: false
  });
  return Prices;
};

// sequelize model:generate --name Prices --attributes created_at:date, have_currency:text, have_amount:REAL, want_currency:text, want_amount:REAL, trade_type:text, stock:integer, ninja_price:REAL, last_updated:date, have_currency_icon:text, want_currency_icon:text