import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { RestaurantsScreen } from "../screens/restaurant.screen";
import { RestaurantDetailScreen } from "../screens/restaurant-detail.screen";
import { Platform } from "react-native";
import { RiceOptionsScreen } from "../screens/riceOption.screen";
import { SwallowOptionsScreen } from "../screens/swallowOption.screen";

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
      <RestaurantStack.Screen
        name="RiceOption"
        component={RiceOptionsScreen} // Add RiceOptionsScreen as a screen
      />
      <RestaurantStack.Screen
        name="SwallowOption"
        component={SwallowOptionsScreen} // Add SwallowOptionsScreen as a screen
      />
    </RestaurantStack.Navigator>
  );
};
