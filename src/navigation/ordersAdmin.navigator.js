import React from "react";
import { OrdersAdminScreen } from "../screens/ordersAdmin.screen";
import { OngoingOrders } from "../screens/ongoingOrders.screen";
import { IncomingOrdersScreen } from "../screens/incomingOrders.screen";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

const OrdersStack = createStackNavigator();

export const OrdersAdminNavigator = ({ route, navigation }) => {
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerMode: "screen",
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <OrdersStack.Screen
        name="OrdersAdmin"
        component={OrdersAdminScreen}
        options={{
          headerShown: false,
        }}
      />
      <OrdersStack.Screen
        name="OngoingOrders"
        component={OngoingOrders}
        options={{
          headerShown: false,
        }}
      />
      <OrdersStack.Screen
        name="IncomingOrders"
        component={IncomingOrdersScreen}
        options={{
          headerShown: false,
        }}
      />
    </OrdersStack.Navigator>
  );
};
