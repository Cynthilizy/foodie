import { db } from "./firebase.service";
import { collection, getDocs } from "firebase/firestore";
import camelize from "camelize";

export const RestaurantsRequest = async () => {
  const restaurantsCollection = collection(db, "restaurants");
  try {
    const snapshot = await getDocs(restaurantsCollection);

    const results = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return results;
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    throw err;
  }
};
export const RestaurantsTransform = ({ results = [] }) => {
  const mappedResults = results.map((restaurant) => {
    return {
      ...restaurant,
      address: restaurant.address,
    };
  });
  const camelizedResults = camelize(mappedResults);
  return camelizedResults;
};
