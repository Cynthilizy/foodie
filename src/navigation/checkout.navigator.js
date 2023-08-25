import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

const CheckoutStack = createStackNavigator();

import { CheckoutScreen } from "../screens/checkout.screen";
import { CheckoutErrorScreen } from "../screens/checkout-error.screen";
import { CheckoutSuccessScreen } from "../screens/checkout-success.screen";
import { CartContext } from "../context/cart.context";

export const CheckoutNavigator = () => {
  const { selectedTitle } = useContext(CartContext);

  return (
    <CheckoutStack.Navigator screenOptions={{ headerShown: false }}>
      <CheckoutStack.Screen
        name="CheckOut"
        component={CheckoutScreen}
        initialParams={{ title: selectedTitle }}
      />
      <CheckoutStack.Screen
        name="CheckoutSuccess"
        component={CheckoutSuccessScreen}
      />
      <CheckoutStack.Screen
        name="CheckoutError"
        component={CheckoutErrorScreen}
      />
    </CheckoutStack.Navigator>
  );
};
