// PhoneNumberInput.js

import React, { useState, forwardRef, useImperativeHandle } from "react";
import PhoneInput from "react-native-phone-number-input";
import { isValidNigerianPhoneNumber } from "./phoneValidation";

export const PhoneNumberInput = forwardRef((props, ref) => {
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useImperativeHandle(ref, () => ({
    isValid: isValidPhoneNumber,
    phoneNumber: phoneNumber,
  }));

  const validatePhoneNumber = (number) => {
    setPhoneNumber(number);
    setIsValidPhoneNumber(isValidNigerianPhoneNumber(number));
  };

  const handleOnChangeText = (text) => {
    validatePhoneNumber(text);
    setErrorMessage(""); // Clear error message when user starts typing
    props.onChangeText(text); // Pass the input value back to parent component
  };

  return (
    <>
      <PhoneInput
        {...props}
        value={phoneNumber}
        onChangePhoneNumber={handleOnChangeText}
      />
      {errorMessage && <Text variant="error">{errorMessage}</Text>}
    </>
  );
});
