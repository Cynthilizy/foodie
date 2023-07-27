var express = require("express");
//const multer = require("multer");
var app = express();
//var fs = require("fs");

var bodyParser = require("body-parser");
var controller = require("./controller");

//const http = require("http");
//const url = require("url");

//const hostname = "127.0.0.1";
const port = process.env.PORT || 3070;

//CORS middleware
var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("assets"));

app.route("/order").get(controller.fetchOrder).post(controller.addOrder);

app
  .route("/order/:id")
  .get(controller.fetchSingleOrder)
  .delete(controller.deleteSingleOrder);

app.route("/items").get(controller.fetchItems);

app
  .route("/items/:id")
  .get(controller.fetchSingleItem)
  .post(controller.addItems)
  .delete(controller.deleteSingleItem);

//app.get("/demodata", controller.addTableData);

const db = require("./models");
// const initRoutes = require("./routes/web");

global.__basedir = __dirname;
// app.use(express.urlencoded({ extended: true }));
// initRoutes(app);

// db.sequelize.sync();
db.sequelize.sync().then(() => {
  console.log("database saved");
});

app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
