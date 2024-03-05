import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AccountScreen } from "../screens/account.screen";
import { LoginCustomerScreen } from "../screens/loginCustomer.screen";
import { LoginAdminScreen } from "../screens/loginAdmin.screen";
import { LoginRiderScreen } from "../screens/loginRider.screen";
import { CustomerForm } from "../screens/customerForm.screen";
import { SendVerificationCode } from "../service/authenticationCustomer.service";
import { SendVerificationCodeRider } from "../service/authenticationRider.service";
import { RidersForm } from "../screens/riderForm.screen";
import { VerifyingScreen } from "../screens/riderPending.screen";
import { VerifyingRejectedScreen } from "../screens/rejectedVerification.screens";

const Stack = createStackNavigator();

export const AccountNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={AccountScreen} />
    <Stack.Screen name="LoginCustomer" component={LoginCustomerScreen} />
    <Stack.Screen name="LoginAdmin" component={LoginAdminScreen} />
    <Stack.Screen name="LoginRider" component={LoginRiderScreen} />
    <Stack.Screen name="CustomerForm" component={CustomerForm} />
    <Stack.Screen name="RidersForm" component={RidersForm} />
    <Stack.Screen
      name="VerificationCodeCustomer"
      component={SendVerificationCode}
    />
    <Stack.Screen
      name="VerificationCodeRider"
      component={SendVerificationCodeRider}
    />
    <Stack.Screen name="Verifying" component={VerifyingScreen} />
    <Stack.Screen name="Rejected" component={VerifyingRejectedScreen} />
  </Stack.Navigator>
);
