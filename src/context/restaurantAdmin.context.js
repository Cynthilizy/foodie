import React, { useState, createContext, useEffect } from "react";
import { RestaurantsTransform } from "../service/restaurantAdmin.service";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../service/firebase.service";

export const RestaurantsAdminContext = createContext();

export const RestaurantsAdminContextProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const q = query(collection(db, "restaurants"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newRestaurants = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setRestaurants(RestaurantsTransform({ results: newRestaurants }));
        setIsLoading(false);
      },
      (err) => {
        setIsLoading(false);
        setError(err);
        console.log("An error occurred", err);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <RestaurantsAdminContext.Provider
      value={{
        restaurants,
        isLoading,
        error,
      }}
    >
      {children}
    </RestaurantsAdminContext.Provider>
  );
};
