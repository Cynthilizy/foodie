const url = require("url");
const functions = require("firebase-functions");

module.exports.placesRequest = (request, response, client) => {
  if (request.method !== "GET") {
    return response.status(405).end(); // Method not allowed
  }

  const { input } = url.parse(request.url, true).query;
  client
    .placeAutocomplete({
      params: {
        input: input,
        location: "6.4450,3.3682",
        radius: "20000",
        key: functions.config().google.key,
      },
      timeout: 1000,
    })
    .then((res) => {
      return response.json(res.data);
    })
    .catch((e) => {
      response.status(400);
      return response.send(e.response.data.error_message);
    });
};
