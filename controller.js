const { Order, Item } = require("./models/connector");
const { ValidationError, Op } = require("sequelize");

const fs = require("fs");

module.exports = {
  addOrder: async function (req, res) {
    try {
      console.log(req.body);
      const Orders = await Order.create(req.body);
      res.status(201);
      res.json(Orders); // send user information that get's id from db
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400);
        res.json(error.errors);
      } else {
        res.status(500);
        res.json({ status: "error in server", error: error, response: null });
        console.log(error);
      }
    }
  },

  fetchOrder: async function (req, res) {
    try {
      const Orders = await Order.findAll();
      res.json(Orders);
    } catch (error) {
      // if promise is reject or any other problem comes up
      res.status(500);
      res.json({ status_text: "error in server: + " + error });
    }
  },
  fetchSingleOrder: async function (req, res) {
    try {
      const Orders = await Order.findAll({
        where: {
          order_id: req.params.id,
        },
      });
      res.json(Orders);
    } catch (error) {
      // if promise is reject or any other problem comes up
      res.status(500);
      res.json({ status_text: "error in server: + " + error });
    }
  },

  deleteSingleOrder: function (req, res) {
    Order.destroy({
      where: {
        order_id: req.params.id,
      },
    })
      .then(() => {
        res.send();
      })
      .catch((error) => {
        res.status(500);
        res.json({ status_text: "error in server: + " + error });
      });
  },

  addItems: async function (req, res) {
    try {
      const orderID = req.params.id;
      const body = req.body;
      console.log("body: ", body);
      const items = [];
      let index = 0;

      while (body["itemName" + index] != undefined) {
        const item_name = body["itemName" + index];
        const item_quantity = body["itemQuantity" + index];
        items.push({ item_name, item_quantity });
        index++;
      }
      console.log("items: ", items);
      console.log("order id: ", orderID);
      const createditems = await Promise.all(
        items.map(async (item) => {
          const newItem = await Item.create({
            item_id: orderID,
            item_name: item.item_name,
            item_quantity: item.item_quantity,
          });
          return newItem;
        })
      );

      res.json(createditems);
    } catch (error) {
      console.log(error);
      if (error instanceof ValidationError) {
        res.status(400);
        res.json(error.errors);
      } else {
        res.status(500);
        res.json({ status: "error in server", error: error, response: null });
        console.log(error);
      }
    }
  },

  fetchItems: async function (req, res) {
    try {
      const items = await Item.findAll();
      res.json(items);
    } catch (error) {
      res.status(500);
      res.json({ status_text: "error in server: " + error });
    }
  },

  fetchSingleItem: async function (req, res) {
    try {
      const items = await Item.findAll();
      res.json(items);
    } catch (error) {
      res.status(500);
      res.json({ status_text: "error in server: " + error });
    }
  },

  deleteSingleItem: function (req, res) {
    Item.destroy({
      where: {
        item_id: req.params.id,
      },
    })
      .then(() => {
        res.send();
      })
      .catch((error) => {
        res.status(500);
        res.json({ status_text: "error in server: + " + error });
      });
  },
};
