import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticationContext } from "./authentication.context";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);

  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [sum, setSum] = useState(0);
  const [itemQuantities, setItemQuantities] = useState({});
  const [selectedTitle, setSelectedTitle] = useState([]);

  const saveCart = async (rst, crt, uid) => {
    try {
      const jsonValue = JSON.stringify({
        restaurant: rst,
        cart: crt,
        selectedTitle: selectedTitle,
      });
      await AsyncStorage.setItem(`@cart-${uid}`, jsonValue);
      // console.log("Cart saved:", jsonValue);
    } catch (e) {
      console.log("error storing", e);
    }
  };

  const loadCart = async (uid) => {
    try {
      const value = await AsyncStorage.getItem(`@cart-${uid}`);
      if (value !== null) {
        const {
          restaurant: rst,
          cart: crt,
          selectedTitle: st,
        } = JSON.parse(value);
        // console.log("Cart loaded:", rst, crt, st);
        setRestaurant(rst);
        setCart(crt);
        setSelectedTitle(st || []);
      }
    } catch (e) {
      console.log("error storing", e);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      loadCart(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      saveCart(restaurant, cart, user.uid);
    }
  }, [restaurant, cart, selectedTitle, user]);

  useEffect(() => {
    if (!cart.length) {
      setSum(0);
      return;
    }
    const newSum = cart.reduce((acc, { price }) => {
      return (acc += price);
    }, 0);
    setSum(newSum);
  }, [cart]);

  const removeOneItemByTitle = (itemTitle) => {
    const indexOfItemToRemove = cart.findIndex(
      (item) => item.item === itemTitle
    );
    if (indexOfItemToRemove !== -1) {
      const updatedCart = [...cart];
      updatedCart.splice(indexOfItemToRemove, 1);
      setCart(updatedCart);
    }
  };

  const add = (item, rst) => {
    const newItem = { ...item, id: cart.length + 1 }; // Assign the length of the current cart as the id
    if (!restaurant || restaurant.placeId !== rst.placeId) {
      setRestaurant(rst);
      setCart([newItem]);
      setSelectedTitle([]);
    } else {
      setCart([...cart, newItem]);
    }
  };

  const clear = () => {
    setCart([]);
    setRestaurant(null);
    setSelectedTitle([]);
  };

  const remove = (itemName) => {
    setCart((prevCart) => prevCart.filter((item) => item.item !== itemName));
  };

  return (
    <CartContext.Provider
      value={{
        addToCart: add,
        clearCart: clear,
        removeFromCart: remove,
        removeOneTitle: removeOneItemByTitle,
        itemQuantities,
        restaurant,
        cart,
        sum,
        selectedTitle,
        setSelectedTitle,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
