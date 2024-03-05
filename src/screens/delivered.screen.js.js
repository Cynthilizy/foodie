import React, { useContext, useEffect, useState } from "react";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import {
  AccountContainer,
  AccountCover,
  AccountBackground,
} from "../stylings/account.styles";
import { Spacer } from "../styles/spacer.styles";
import LottieView from "lottie-react-native";
import { AnimationWrapper } from "../stylings/account.styles";
import { Animations } from "../animations";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { db } from "../service/firebase.service";
import { View } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  background-color: rgba(255, 255, 255, 0.7);
  padding: ${(props) => props.theme.space[4]};
  margin-top: ${(props) => props.theme.space[2]};
`;

export const DeliveredScreen = ({ route, navigation }) => {
  return (
    <TabLink>
      <AccountCover />
      <View style={{ width: "100%", height: "45%", paddingTop: 30 }}>
        <LottieView
          source={Animations.Delivered}
          autoPlay={true}
          loop={true}
          resizeMode="cover"
        />
      </View>
      <Spacer position="top" size="xxl" />
      <Text variant="label" style={{ textAlign: "center" }}>
        Your Meal Has Been Delivered
      </Text>
    </TabLink>
  );
};
