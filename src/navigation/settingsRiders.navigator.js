import React from "react";
import { RidersSettingsScreen } from "../screens/riderSettings.screen";
import { AccountScreen } from "../screens/account.screen";
import { RiderInfoScreen } from "../screens/riderInfo.screen";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { CameraScreenRider } from "../screens/cameraRider.screen";

const SettingsStack = createStackNavigator();

export const SettingsRiderNavigator = ({ route, navigation }) => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <SettingsStack.Screen
        name="SettingRider"
        component={RidersSettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <SettingsStack.Screen name="CameraRider" component={CameraScreenRider} />
      <SettingsStack.Screen name="Main" component={AccountScreen} />
      <SettingsStack.Screen name="RiderInfo" component={RiderInfoScreen} />
    </SettingsStack.Navigator>
  );
};
