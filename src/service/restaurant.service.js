import camelize from "camelize";
import { Host } from "../utils/enviroment";

export const RestaurantsRequest = (location = "6.465422,3.406448") => {
  return fetch(`${Host}/restaurants?location=${location}`).then((res) => {
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
