import stripe from "stripe-client";
import { Host } from "../utils/enviroment";
import { db } from "./firebase.service";
import { doc, setDoc, updateDoc, getDoc, collection } from "firebase/firestore";

export const cardTokenRequest = (card) => stripe.createToken({ card });

export const payRequest = (token, amount, name) => {
  return fetch(`${Host}/pay`, {
    body: JSON.stringify({
      token,
      name,
      amount,
    }),
    method: "POST",
  }).then((res) => {
    if (!res.ok) {
      return Promise.reject(
        "something wenthttps://moodle.savonia.fi/course/view.php?id=1152 wrong processing your payment"
      );
    }
    return res.json();
  });
};

export const placesRequest = (address) => {
  return fetch(`${Host}/places?input=${encodeURIComponent(address)}`, {
    method: "GET",
  }).then((res) => {
    if (res.status !== 200) {
      return Promise.reject("something went wrong fetching address");
    }
    return res.json();
  });
};

export const deliveryFeeRequest = (origin, destination) => {
  console.log(`Origin: ${origin}, Destination: ${destination}`);
  return fetch(`${Host}/deliveryFee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      origin,
      destination,
    }),
  })
    .then((res) => {
      if (res.status !== 200) {
        return Promise.reject("Something went wrong fetching the delivery fee");
      }
      return res.json();
    })
    .then((data) => {
      if (data && data.deliveryFee) {
        return data.deliveryFee;
      } else {
        return Promise.reject("Could not retrieve the delivery fee");
      }
    });
};

export const convertAddToLatLng = async (add) => {
  return fetch(`${Host}/convertAddToLatLng`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: add,
    }),
  })
    .then((res) => {
      if (res.status !== 200) {
        return Promise.reject("Something went wrong converting address");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    });
};
