import camelize from "camelize";

export const RestaurantsRequest = (location = "6.465422,3.406448") => {
  return fetch(
    `https://80d6-2001-14ba-606f-e00-c3c-33f3-2b17-89c8.ngrok-free.app/projectvic-88bda/us-central1/restaurants?location=${location}`
  ).then((res) => {
    return res.json();
  });
};

export const RestaurantsTransform = ({ results = [] }) => {
  const mappedResults = results.map((restaurant) => {
    return {
      ...restaurant,
      address: restaurant.vicinity,
    };
  });

  return camelize(mappedResults);
};
