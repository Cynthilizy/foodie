import React, { useState, useContext, useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native-paper";
import {
  AccountBackground,
  AccountCover,
  AccountContainer,
  AuthButton,
  AuthInput,
  ErrorContainer,
  Title,
} from "../stylings/account.styles";
import { Text } from "../styles/text.styles";
import { Spacer } from "../styles/spacer.styles";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import { isValidNigerianPhoneNumber } from "../features/phoneValidation";

export const LoginRiderScreen = ({ navigation }) => {
  const [isValidphoneNumberRider, setIsValidPhoneNumberRider] = useState(false);
  const [phoneNumberRider, setPhoneNumberRider] = useState("");
  const { error, isLoadingRider, onLoginRider, setError } = useContext(
    AuthenticationContextRider
  );
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoadingRider) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [isLoadingRider]);

  const handleLogin = async () => {
    if (isValidphoneNumberRider) {
      try {
        setShowLoading(true);
        await onLoginRider(phoneNumberRider, navigation);
      } finally {
        setShowLoading(false);
      }
    } else {
      setError("Please use a valid Nigerian phone number");
    }
  };

  const validatePhoneNumberRider = (number) => {
    setIsValidPhoneNumberRider(isValidNigerianPhoneNumber(number));
  };

  return (
    <AccountBackground>
      <AccountCover />
      <Title>Foodie Rider</Title>
      <AccountContainer>
        <AuthInput
          label="Phone Number"
          value={phoneNumberRider}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
          autoCapitalize="none"
          onChangeText={(u) => {
            setPhoneNumberRider(u);
            validatePhoneNumberRider(u); // Validate phone number
          }}
        />
        <Spacer size="large" />
        {error && (
          <ErrorRiderContainer size="large">
            <Text variant="error">{error}</Text>
          </ErrorRiderContainer>
        )}
        <Spacer size="large">
          {!showLoading ? (
            <AuthButton
              icon="lock-open-outline"
              mode="contained"
              onPress={handleLogin}
              disabled={!isValidphoneNumberRider}
            >
              Login
            </AuthButton>
          ) : (
            <ActivityIndicator size={25} animating={true} color="#0000FF" />
          )}
        </Spacer>
      </AccountContainer>
      <Spacer size="large">
        <AuthButton
          mode="contained"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate("Main");
            }
          }}
        >
          Back
        </AuthButton>
      </Spacer>
    </AccountBackground>
  );
};
