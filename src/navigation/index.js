import React, { useContext } from "react";
import { MyTabs } from "./app.navigator";
import { AccountNavigator } from "./account.navigator";
import { AuthenticationContext } from "../context/authentication.context";
import { NavigationContainer } from "@react-navigation/native";

export const Navigation = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MyTabs /> : <AccountNavigator />}
    </NavigationContainer>
  );
};
