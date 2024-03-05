import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MyTabs } from "./app.navigator";
import { MyAdminTabs } from "./appAdmin.navigator";
import { MyRiderDrawer } from "./ridersDrawer.navigator";
import { AccountNavigator } from "./account.navigator";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export const navigationRef = React.createRef();

const MainNavigator = () => {
  const { isAuthenticated } = useContext(AuthenticationContextCustomer);
  const { isAuthenticatedAdmin } = useContext(AuthenticationContextAdmin);
  const { isAuthenticatedRider, rider } = useContext(
    AuthenticationContextRider
  );

  let initialRouteName = "AccountNavigator";

  if (isAuthenticated) {
    initialRouteName = "MyTabs";
  }
  if (isAuthenticatedAdmin) {
    initialRouteName = "MyAdminTabs";
  }
  if (isAuthenticatedRider) {
    if (rider.riderStatus == "Accepted") {
      initialRouteName = "MyRiderTabs";
    }
  }
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MyTabs" component={MyTabs} />
      <Stack.Screen name="MyAdminTabs" component={MyAdminTabs} />
      <Stack.Screen name="MyRiderTabs" component={MyRiderDrawer} />
      <Stack.Screen name="AccountNavigator" component={AccountNavigator} />
    </Stack.Navigator>
  );
};

export const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator />
    </NavigationContainer>
  );
};
