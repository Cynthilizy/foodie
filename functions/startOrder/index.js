const fetch = require("node-fetch");
const functions = require("firebase-functions");

module.exports.addToLatLng = async (request, response) => {
  try {
    const address = request.body.address;
    console.log("Received request with address:", request.body.address);
    if (!address) {
      return response.status(400).json({ error: "Address is required" });
    }

    const apiKey = functions.config().google.key;

    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const res = await fetch(geocodingUrl);
    const data = await res.json();

    if (
      !data.results ||
      !data.results[0] ||
      !data.results[0].geometry ||
      !data.results[0].geometry.location
    ) {
      return response
        .status(400)
        .json({ error: "Could not fetch lat/lng for the given address" });
    }

    const { lat, lng } = data.results[0].geometry.location;

    return response.status(200).json({ lat, lng });
  } catch (error) {
    console.error("Error in geocoding: ", JSON.stringify(error, null, 2));
    return response.status(500).json({ error: "Internal server error" });
  }
};
