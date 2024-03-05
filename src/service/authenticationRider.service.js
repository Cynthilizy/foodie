import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import { auth, firebaseConfig, app } from "../service/firebase.service";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";

export const SendVerificationCodeRider = ({ route, navigation }) => {
  const [verificationCodeRider, setVerificationCodeRider] = useState("");
  const { phoneRiderNumber, verificationRiderId, recaptchaVerifier } =
    route.params;
  console.log("verification id after route:", verificationRiderId);

  const { errorRider, setErrorRider } = useContext(AuthenticationContextRider);

  const handleVerifyCodeRider = async () => {
    if (!verificationRiderId) {
      console.error("Please complete the CAPTCHA verification first.");
      return;
    }
    try {
      const credential = PhoneAuthProvider.credential(
        verificationRiderId,
        verificationCodeRider
      );
      await signInWithCredential(auth, credential);
      navigation.navigate("RidersForm", { phoneRiderNumber: phoneRiderNumber });
    } catch (errorRider) {
      setErrorRider(`errorRider: ${errorRider.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={verificationCodeRider}
        onChangeText={setVerificationCodeRider}
        keyboardType="numeric"
      />
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      <Button
        title="Verify"
        onPress={handleVerifyCodeRider}
        disabled={!verificationRiderId}
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
