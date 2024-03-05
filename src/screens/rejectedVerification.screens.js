import React, { useContext, useEffect, useState } from "react";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import { AccountCover } from "../stylings/account.styles";
import { Spacer } from "../styles/spacer.styles";
import LottieView from "lottie-react-native";
import { Animations } from "../animations";
import { View } from "react-native";
import { colors } from "../styles/colors.styles";

export const VerifyingRejectedScreen = ({ route, navigation }) => {
  return (
    <TabLink>
      <AccountCover />
      <View style={{ width: "100%", height: "45%", paddingTop: 30 }}>
        <LottieView
          source={Animations.Rejected}
          autoPlay={true}
          loop={true}
          resizeMode="contain"
        />
      </View>
      <Spacer position="top" size="xxl" />
      <Text variant="label" style={{ textAlign: "center" }}>
        Sorry You Did Not Pass Our Verification Process
      </Text>
      <Spacer position="top" sixe="xxl" />
      <Text style={{ textAlign: "center" }}>
        Contact Customer Care{" "}
        <Text style={{ color: colors.brand.primary, fontWeight: "bold" }}>
          Here
        </Text>
      </Text>
    </TabLink>
  );
};
