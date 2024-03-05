import React, { useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Spacer } from "../styles/spacer.styles";
import {
  AccountBackground,
  AccountCover,
  AccountContainer,
  AuthButton,
  Title,
} from "../stylings/account.styles";
import LottieView from "lottie-react-native";
import { AnimationWrapper } from "../stylings/account.styles";
import { Animations } from "../animations";
import { Text } from "../styles/text.styles";
import Icon from "react-native-vector-icons/AntDesign";
import { colors } from "../styles/colors.styles";

export const AccountScreen = ({ navigation }) => {
  return (
    <AccountBackground>
      <AccountCover />
      <AnimationWrapper>
        <LottieView
          source={Animations.HotDog}
          autoPlay={true}
          loop={true}
          resizeMode="cover"
        />
      </AnimationWrapper>
      <Spacer position="bottom" size="xxl" />
      <Title>Foodie</Title>
      <AccountContainer>
        <Text
          variant="label"
          style={{ textAlign: "center", fontWeight: "bold" }}
        >
          Login As
        </Text>
        <Spacer position="bottom" size="small" />
        <AuthButton
          icon="human"
          mode="contained"
          onPress={() => navigation.navigate("LoginCustomer")}
        >
          Customer
        </AuthButton>
        <Spacer size="large">
          <AuthButton
            icon="bike"
            mode="contained"
            onPress={() => navigation.navigate("LoginRider")}
          >
            Rider
          </AuthButton>
          <Spacer size="large">
            <AuthButton
              mode="contained"
              onPress={() => navigation.navigate("LoginAdmin")}
            >
              <Icon
                name="customerservice"
                size={20}
                color={colors.text.inverse}
              />
              Staff
            </AuthButton>
          </Spacer>
        </Spacer>
      </AccountContainer>
    </AccountBackground>
  );
};
