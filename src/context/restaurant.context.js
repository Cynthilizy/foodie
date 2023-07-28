import React, { useState, useMemo, createContext, useEffect } from "react";
import {
  RestaurantsRequest,
  RestaurantsTransform,
} from "../service/restaurant.service";

export const RestaurantsContext = createContext();

export const RestaurantsContextProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const retrieveRestaurants = () => {
    setIsLoading(true);
    setRestaurants([]);

    RestaurantsRequest()
      .then(RestaurantsTransform)
      .then((results) => {
        setIsLoading(false);
        setRestaurants(results);
        console.log(restaurants);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err);
        console.log(err);
      });
  };
  useEffect(() => {
    retrieveRestaurants();
  }, []);

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        isLoading,
        error,
      }}
    >
      {children}
    </RestaurantsContext.Provider>
  );
};
