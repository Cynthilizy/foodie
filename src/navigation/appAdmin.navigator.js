import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RestaurantsAdminNavigator } from "./restaurantAdmin.navigator";
import { colors } from "../styles/colors.styles";
import { RestaurantsAdminContextProvider } from "../context/restaurantAdmin.context";
import { SettingsAdminNavigator } from "./settingsAdmin.navigator";
import { OrdersAdminNavigator } from "./ordersAdmin.navigator";
import { OngoingOrders } from "../screens/ongoingOrders.screen";
import { IncomingOrdersScreen } from "../screens/incomingOrders.screen";

const Tab = createBottomTabNavigator();

export const MyAdminTabs = () => {
  return (
    <RestaurantsAdminContextProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Restaurants") {
              iconName = focused ? "restaurant-sharp" : "restaurant-sharp";
            } else if (route.name === "Orders") {
              iconName = focused ? "md-cart" : "md-cart";
            } else if (route.name === "Ongoing") {
              iconName = focused ? "md-time" : "md-time";
            } else if (route.name === "Incoming") {
              iconName = focused ? "arrow-down" : "arrow-down";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings";
            }
            return <Ionicons name={iconName} color={color} size={size} />;
          },
          tabBarActiveTintColor: colors.brand.primary,
          tabBarInactiveTintColor: colors.brand.muted,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Restaurants" component={RestaurantsAdminNavigator} />
        <Tab.Screen name="Orders" component={OrdersAdminNavigator} />
        <Tab.Screen name="Ongoing" component={OngoingOrders} />
        <Tab.Screen name="Incoming" component={IncomingOrdersScreen} />
        <Tab.Screen name="Settings" component={SettingsAdminNavigator} />
      </Tab.Navigator>
    </RestaurantsAdminContextProvider>
  );
};
