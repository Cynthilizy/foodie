const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize) => {
  const Item = sequelize.define(
    "Item",
    {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      item_name: {
        type: DataTypes.CHAR(80),
        primaryKey: true,
      },
      item_quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Item",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["item_id", "item_name"],
        },
      ],
    }
  );

  return Item;
};
