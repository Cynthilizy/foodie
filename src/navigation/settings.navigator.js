import React from "react";
import { SettingsScreen } from "../screens/settings.screen";
import { FavouritesScreen } from "../screens/favourites.screen";
import { AccountScreen } from "../screens/account.screen";
import { UserInfoScreen } from "../screens/userInfo.screen";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { CameraScreen } from "../screens/camera.screen";

const SettingsStack = createStackNavigator();

export const SettingsNavigator = ({ route, navigation }) => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <SettingsStack.Screen
        name="Setting"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <SettingsStack.Screen name="Favourites" component={FavouritesScreen} />
      <SettingsStack.Screen name="Camera" component={CameraScreen} />
      <SettingsStack.Screen name="Main" component={AccountScreen} />
      <SettingsStack.Screen name="UserInfo" component={UserInfoScreen} />
    </SettingsStack.Navigator>
  );
};
