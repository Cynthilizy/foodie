import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { RestaurantsNavigator } from "./restaurant.navigator";
import { colors } from "../styles/colors.styles";
import { SearchScreen } from "../screens/search.screen";
import { FavouritesContextProvider } from "../context/favourite.context";
import { RestaurantsContextProvider } from "../context/restaurant.context";
import { SettingsNavigator } from "./settings.navigator";
//import { CheckoutNavigator } from "./checkout.navigator";
//import { CartContextProvider } from "../context/cart.context";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";

const Tab = createBottomTabNavigator();

export const MyTabs = () => {
  const CheckoutView = () => (
    <TabLink>
      <Text>checkout</Text>
    </TabLink>
  );
  return (
    <FavouritesContextProvider>
      <RestaurantsContextProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Restaurants") {
                iconName = focused ? "restaurant-sharp" : "restaurant-sharp";
              } else if (route.name === "Search") {
                iconName = focused ? "search" : "search";
              } else if (route.name === "Settings") {
                iconName = focused ? "settings" : "settings";
              } else if (route.name === "Checkout") {
                iconName = focused ? "md-cart" : "md-cart";
              }
              return <Ionicons name={iconName} color={color} size={size} />;
            },
            tabBarActiveTintColor: colors.brand.primary,
            tabBarInactiveTintColor: colors.brand.muted,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Restaurants" component={RestaurantsNavigator} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Checkout" component={CheckoutView} />
          <Tab.Screen name="Settings" component={SettingsNavigator} />
        </Tab.Navigator>
      </RestaurantsContextProvider>
    </FavouritesContextProvider>
  );
};
