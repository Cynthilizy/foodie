import React, { useState, useContext } from "react";
import { confirmVerificationCode } from "firebase/auth";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

export const verificationCodeRiderInputScreen = ({ route, navigation }) => {
  console.log("now in Ve");
  const [verificationCodeRider, setVerificationCodeRider] = useState("");
  const { phoneNumberRider, verificationRiderCode } = route.params;

  const handleVerifyCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(
        verificationRiderCode,
        verificationCodeRider
      );
      await confirmVerificationCode(auth, credential);

      navigation.navigate("RidersForm", {
        phoneNumberRider: phoneNumberRider,
      });
    } catch (error) {
      console.error("Verification failed:", error);
      Alert.alert(
        "Verification Failed",
        "Incorrect code",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Main"),
          },
        ],
        { cancelable: false }
      );
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
      <Button title="Verify" onPress={handleVerifyCode} />
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
