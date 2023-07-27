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

export const AccountScreen = ({ navigation }) => {
  /* const animationRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      animationRef.current?.play();
      return () => {
        animationRef.current?.reset();
      };
    }, [])
  );*/

  return (
    <AccountBackground>
      <AccountCover />
      <AnimationWrapper>
        <LottieView
          source={Animations.HotDog}
          //ref={animationRef}
          autoPlay={true}
          loop={true}
          resizeMode="cover"
        />
      </AnimationWrapper>
      <Title>Foodie</Title>
      <AccountContainer>
        <AuthButton
          icon="lock-open-outline"
          mode="contained"
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </AuthButton>
        <Spacer size="large">
          <AuthButton
            icon="email"
            mode="contained"
            onPress={() => navigation.navigate("Register")}
          >
            Register
          </AuthButton>
        </Spacer>
      </AccountContainer>
    </AccountBackground>
  );
};
