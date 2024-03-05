import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { auth, firebaseConfig, app } from "../service/firebase.service";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";

export const SendVerificationCode = ({ route, navigation }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const { phoneNumber, verificationId, recaptchaVerifier } = route.params;
  console.log("verification id after route:", verificationId);

  const { error, setError } = useContext(AuthenticationContextCustomer);

  const handleVerifyCode = async () => {
    if (!verificationId) {
      console.error("Please complete the CAPTCHA verification first.");
      return;
    }
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await signInWithCredential(auth, credential);
      navigation.navigate("CustomerForm", {
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      setError(`Error : ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        keyboardType="numeric"
      />
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      <Button
        title="Verify"
        onPress={handleVerifyCode}
        disabled={!verificationId}
      />

      {<FirebaseRecaptchaBanner />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
