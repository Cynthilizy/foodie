import camelize from "camelize";
import { dataImages, data } from "../data";

export const RestaurantsRequest = (location = "6.465422,3.406448") => {
  return new Promise((resolve, reject) => {
    const mock = data[location];
    if (!mock) {
      reject("not found");
    }
    resolve(mock);
  });
};

export const RestaurantsTransform = ({ results = [] }) => {
  let currentImageIndex = 0;

  const addDataImage = (restaurant) => {
    if (currentImageIndex < dataImages.length) {
      const imageToAdd = dataImages[currentImageIndex];
      restaurant.photos = [imageToAdd];
      currentImageIndex++;
    } else {
      currentImageIndex = 0;
      restaurant.photos = [];
    }
    return restaurant;
  };

  const mappedResults = results.map((restaurant) => {
    addDataImage(restaurant); // Pass the restaurant object to the addDataImage function.

    return {
      ...restaurant,
      address: restaurant.vicinity,
    };
  });

  return camelize(mappedResults);
};
