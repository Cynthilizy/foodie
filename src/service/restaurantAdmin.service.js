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
    //console.log("fetched restaurants:", results); // <-- Moved outside
    return results;
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    throw err;
  }
};
export const RestaurantsTransform = ({ results = [] }) => {
  // console.log("Received for transformation:", results);
  const mappedResults = results.map((restaurant) => {
    return {
      ...restaurant,
      address: restaurant.address,
    };
  });
  // console.log("Mapped Results:", mappedResults);
  const camelizedResults = camelize(mappedResults);
  // console.log("Camelized Results:", camelizedResults);
  return camelizedResults;
};
