const functions = require("firebase-functions");
const { restaurantRequest } = require("./restaurants");
const { payRequest } = require("./pay");

const stripeClient = require("stripe")(functions.config().stripe.key);

exports.restaurants = functions.https.onRequest((request, response) => {
  restaurantRequest(request, response);
});

exports.pay = functions.https.onRequest((request, response) => {
  payRequest(request, response, stripeClient);
});
