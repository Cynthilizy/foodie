import React, { useContext, useEffect, useState } from "react";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import { AccountCover } from "../stylings/account.styles";
import { Spacer } from "../styles/spacer.styles";
import LottieView from "lottie-react-native";
import { Animations } from "../animations";
import { View } from "react-native";

export const VerifyingScreen = ({ route, navigation }) => {
  console.log("VerifyingScreen is rendered");
  return (
    <TabLink>
      <AccountCover />
      <View style={{ width: "100%", height: "45%", paddingTop: 30 }}>
        <LottieView
          source={Animations.Verifying}
          autoPlay={true}
          loop={true}
          resizeMode="cover"
        />
      </View>
      <Spacer position="top" size="xxl" />
      <Text variant="label" style={{ textAlign: "center" }}>
        We Are Still Verifying Your Identity
      </Text>
    </TabLink>
  );
};
