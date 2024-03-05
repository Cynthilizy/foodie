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
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { isValidNigerianPhoneNumber } from "../features/phoneValidation";

export const LoginCustomerScreen = ({ navigation }) => {
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { error, isLoading, onLogin, setError } = useContext(
    AuthenticationContextCustomer
  );
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);

  const handleLogin = async () => {
    if (isValidPhoneNumber) {
      try {
        setShowLoading(true);
        await onLogin(phoneNumber, navigation);
      } finally {
        setShowLoading(false);
      }
    } else {
      setError("Please use a valid Nigerian phone number");
    }
  };

  const validatePhoneNumber = (number) => {
    setIsValidPhoneNumber(isValidNigerianPhoneNumber(number));
  };

  return (
    <AccountBackground>
      <AccountCover />
      <Title>Foodie</Title>
      <AccountContainer>
        <AuthInput
          label="Phone Number"
          value={phoneNumber}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
          autoCapitalize="none"
          onChangeText={(u) => {
            setPhoneNumber(u);
            validatePhoneNumber(u); // Validate phone number
          }}
        />
        <Spacer size="large" />
        {error && (
          <ErrorContainer size="large">
            <Text variant="error">{error}</Text>
          </ErrorContainer>
        )}
        <Spacer size="large">
          {!showLoading ? (
            <AuthButton
              icon="lock-open-outline"
              mode="contained"
              onPress={handleLogin}
              disabled={!isValidPhoneNumber}
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
