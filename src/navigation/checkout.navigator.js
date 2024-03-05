import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

const CheckoutStack = createStackNavigator();

import { CheckoutScreen } from "../screens/checkout.screen";
import { DeliveredScreen } from "../screens/delivered.screen.js";
import { CheckoutSuccessScreen } from "../screens/checkout-success.screen";
import { CartContext } from "../context/cart.context";
import { PayScreen } from "../screens/payHere.screen";

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
      <CheckoutStack.Screen name="PayHere" component={PayScreen} />
      <CheckoutStack.Screen
        name="DeliveredScreen"
        component={DeliveredScreen}
      />
    </CheckoutStack.Navigator>
  );
};
