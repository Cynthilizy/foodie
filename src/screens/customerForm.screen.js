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
import { saveUserDataToFirestore } from "../service/firestore.service";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { Alert } from "react-native";

const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(String(email).toLowerCase());
};

export const CustomerForm = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { isLoading, onUserAuthenticated, recheckAuthentication } = useContext(
    AuthenticationContextCustomer
  );
  const [showLoading, setShowLoading] = useState(false);

  const isFormComplete =
    username !== "" && (email === "" || isValidEmail(email));

  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [isLoading]);

  const handleSubmit = async () => {
    try {
      setShowLoading(true);
      const userData = {
        username,
        email,
        phone: phoneNumber,
        role: "user",
        profilePicture: null,
        homeAddress: null,
        officeAddress: null,
      };

      await saveUserDataToFirestore(phoneNumber, userData);
      await recheckAuthentication(phoneNumber);
    } catch (error) {
      console.error("Error while handling submit:", error);
    } finally {
      setShowLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    if (username !== "" && email !== "" && !isValidEmail(email)) {
      Alert.alert(
        "Invalid Email",
        "Continue Without Email?",
        [
          {
            text: "Yes",
            onPress: () => {
              setEmail("");
              handleSubmit();
            },
          },
          {
            text: "No",
            onPress: () => {},
          },
        ],
        { cancelable: true }
      );
      return;
    }
    handleSubmit();
  };

  return (
    <AccountBackground>
      <Title>Welcome To Foodie</Title>
      <Text>Complete your profile</Text>
      <AccountContainer>
        <AuthInput
          placeholder="set Username"
          value={username}
          onChangeText={setUsername}
        />
        <AuthInput placeholder="email" value={email} onChangeText={setEmail} />
        <Spacer size="large">
          {!showLoading ? (
            <AuthButton
              icon="lock-open-outline"
              mode="contained"
              onPress={handleFormSubmit}
              disabled={!isFormComplete}
            >
              Continue
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
