import React, { useState, useContext, useEffect } from "react";
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
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";

export const LoginAdminScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { onLogin, error, isLoading } = useContext(AuthenticationContextAdmin);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);

  const handleLogin = () => {
    setShowLoading(true);
    setTimeout(() => {
      onLogin(email, password);
    }, 2000);
  };

  return (
    <AccountBackground>
      <AccountCover />
      <Title>Foodie Kitchen</Title>
      <AccountContainer>
        <AuthInput
          label="Username"
          value={email}
          textContentType="emailAddress"
          placeholder="example@foodie.com"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(u) => setEmail(u)}
        />
        <Spacer size="large">
          <AuthInput
            label="Foodie Password"
            value={password}
            textContentType="password"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(p) => setPassword(p)}
          />
        </Spacer>
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
            >
              Login
            </AuthButton>
          ) : (
            <ActivityIndicator size={25} animating={true} color="#0000FF" />
          )}
        </Spacer>
      </AccountContainer>
      <Spacer size="large">
        <AuthButton mode="contained" onPress={() => navigation.goBack()}>
          Back
        </AuthButton>
      </Spacer>
    </AccountBackground>
  );
};
