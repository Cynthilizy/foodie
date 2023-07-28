const { data, addDataImage } = require("./data");
const url = require("url");

module.exports.restaurantRequest = (request, response) => {
  const { location } = url.parse(request.url, true).query;
  const mocks = data[location];
  if (mocks) {
    mocks.results = mocks.results.map((restaurant, index) =>
      addDataImage(restaurant, index)
    );
  }

  response.json(mocks);
};
