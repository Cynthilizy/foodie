import React from "react";
import { SettingsAdminScreen } from "../screens/settingsAdmin.screen";
import { AccountScreen } from "../screens/account.screen";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

const SettingsStack = createStackNavigator();

export const SettingsAdminNavigator = ({ route, navigation }) => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <SettingsStack.Screen
        name="SettingAdmin"
        component={SettingsAdminScreen}
        options={{
          headerShown: false,
        }}
      />
      <SettingsStack.Screen name="Main" component={AccountScreen} />
    </SettingsStack.Navigator>
  );
};
