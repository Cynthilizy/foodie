import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { RestaurantsScreen } from "../screens/restaurant.screen";
import { RestaurantDetailScreen } from "../screens/restaurant-detail.screen";
import { Platform } from "react-native";

const RestaurantStack = createStackNavigator();
const isAndroid = Platform.OS === "android";

export const RestaurantsNavigator = () => {
  return (
    <RestaurantStack.Navigator
      screenOptions={() => {
        const headerShown = false;
        const transitionPreset = isAndroid
          ? TransitionPresets.ModalTransition
          : TransitionPresets.ModalPresentationIOS;

        return {
          headerShown,
          ...transitionPreset,
        };
      }}
    >
      <RestaurantStack.Screen name="Restaurant" component={RestaurantsScreen} />
      <RestaurantStack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
      />
    </RestaurantStack.Navigator>
  );
};
