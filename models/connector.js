const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("orderDB", "appuser", "mypassword", {
  host: "localhost",
  port: 3306,
  dialect: "mariadb",
});

const OrderModel = require("./order");
const ItemModel = require("./items");

const Order = OrderModel(sequelize);
const Item = ItemModel(sequelize);

//Item.hasOne(Order);
//Order.belongsTo(Item);

sequelize.sync();

const db = {
  Order,
  Item,
};
module.exports = db;
