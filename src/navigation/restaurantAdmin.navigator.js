import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { RestaurantsAdminScreen } from "../screens/restaurantAdmin.screen";
import { RestaurantAdminDetailScreen } from "../screens/restaurantAdmin-detail.screen";
import { Platform } from "react-native";
import { MealOptionScreen } from "../screens/selectedMealAdmin.screen";

const RestaurantStack = createStackNavigator();
const isAndroid = Platform.OS === "android";

export const RestaurantsAdminNavigator = () => {
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
      <RestaurantStack.Screen
        name="RestaurantAdmin"
        component={RestaurantsAdminScreen}
      />
      <RestaurantStack.Screen
        name="RestaurantAdminDetail"
        component={RestaurantAdminDetailScreen}
      />
      <RestaurantStack.Screen name="MealOption" component={MealOptionScreen} />
    </RestaurantStack.Navigator>
  );
};
