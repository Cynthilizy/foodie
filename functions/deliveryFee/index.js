const fetch = require("node-fetch");
const functions = require("firebase-functions");

module.exports.deliveryFeeRequest = async (request, response) => {
  try {
    const origin = request.body.origin || "6.4450,3.3682"; // default Apapa location
    const destination = request.body.destination;
    if (!destination) {
      return response.status(400).json({ error: "Destination is required" });
    }

    const apiKey = functions.config().google.key;

    const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;

    const res = await fetch(distanceMatrixUrl);
    const data = await res.json();

    if (
      !data.rows ||
      !data.rows[0] ||
      !data.rows[0].elements ||
      !data.rows[0].elements[0].distance
    ) {
      return response
        .status(400)
        .json({ error: "Could not calculate distance" });
    }

    const distanceInMeters = data.rows[0].elements[0].distance.value;

    // Assuming 100 Naira for every 100 meters
    const deliveryFee = Math.ceil(distanceInMeters / 2000) * 100;

    return response.status(200).json({ deliveryFee });
  } catch (error) {
    console.error(
      "Error in distance calculation: ",
      JSON.stringify(error, null, 2)
    );
    return response.status(500).json({ error: "Internal server error" });
  }
};
