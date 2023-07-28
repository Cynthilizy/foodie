const functions = require("firebase-functions");
const { restaurantRequest } = require("./restaurants");

exports.restaurants = functions.https.onRequest((request, response) => {
  restaurantRequest(request, response);
});
