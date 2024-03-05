const functions = require("firebase-functions");
const { payRequest } = require("./pay");
const stripeClient = require("stripe")(functions.config().stripe.key);
const { placesRequest } = require("./places");
const { deliveryFeeRequest } = require("./deliveryFee");
const { Client } = require("@googlemaps/google-maps-services-js");
const googleClient = new Client({});
const { addToLatLng } = require("./startOrder");

exports.places = functions.https.onRequest((request, response) => {
  placesRequest(request, response, googleClient);
});

exports.pay = functions.https.onRequest((request, response) => {
  payRequest(request, response, stripeClient);
});

exports.deliveryFee = functions.https.onRequest((request, response) => {
  deliveryFeeRequest(request, response);
});

exports.convertAddToLatLng = functions.https.onRequest((request, response) => {
  addToLatLng(request, response);
});
