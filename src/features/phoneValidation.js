const nigerianPhoneNumberRegex = /^(\+?234|0)([789]\d{9})$/;

export const isValidNigerianPhoneNumber = (phoneNumber) => {
  return nigerianPhoneNumberRegex.test(phoneNumber);
};
