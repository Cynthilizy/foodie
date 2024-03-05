import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors.styles";
import { SettingsRiderNavigator } from "./settingsRiders.navigator";
import { OngoingOrdersRiders } from "../screens/ridersOngoingOrders.screen";
import { OrdersPondScreen } from "../screens/riderIncomingOrder.screen";
import { MapScreen } from "../screens/ridersMap.screen";
import { Spacer } from "../styles/spacer.styles";
import { EarningsScreen } from "../screens/earningsRider.screen";

const Drawer = createDrawerNavigator();

const getIconName = (routeName) => {
  switch (routeName) {
    case "Home":
      return "home";
    case "Accepted-Orders":
      return "md-time";
    case "Incoming-Orders":
      return "arrow-down";
    case "Earnings":
      return "md-cash";
    case "Settings":
      return "settings";
    default:
      return "md-time";
  }
};

export const MyRiderDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            {props.state.routes.map((route, index) => {
              const focused = index === props.state.index;
              const color = focused ? colors.brand.primary : colors.brand.muted;
              const iconName = getIconName(route.name);
              return (
                <DrawerItem
                  key={route.key}
                  label={route.name}
                  onPress={() => props.navigation.navigate(route.name)}
                  icon={({ size }) => (
                    <Ionicons name={iconName} color={color} size={size} />
                  )}
                />
              );
            })}
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen name="Home" component={MapScreen} />
      <Drawer.Screen
        name="AcceptedOrdersRiders"
        component={OngoingOrdersRiders}
      />
      <Drawer.Screen name="IncomingOrdersRiders" component={OrdersPondScreen} />
      <Drawer.Screen name="Earnings" component={EarningsScreen} />
      <Drawer.Screen
        name="SettingsRiders"
        component={SettingsRiderNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};
