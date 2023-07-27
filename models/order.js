const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_name: {
        type: DataTypes.CHAR(80),
      },
      customer_address: {
        type: DataTypes.CHAR(80),
      },
      item_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Order",
      timestamps: false,
    }
  );
  return Order;
};
