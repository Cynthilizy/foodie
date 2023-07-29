import createStripe from "stripe-client";
import { Host } from "../utils/enviroment";

const stripe = createStripe(
  "pk_test_51NQZhKCjeBomT2qOuhRIBBSH2MTmrYQ7Mc7fkLVtMzK6UVLTnGCCzNuTVC4f45YocpfLtcPhMsKK5djT1lT8Myty00lB3qblli"
);

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
    if (res.status > 200) {
      return Promise.reject("something went wrong processing your payment");
    }
    return res.json();
  });
};
