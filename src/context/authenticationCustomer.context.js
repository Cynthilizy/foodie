import React, { useState, createContext, useEffect, useRef } from "react";
import { db, auth, app } from "../service/firebase.service";
import { signOut, onAuthStateChanged, PhoneAuthProvider } from "firebase/auth";
import { navigationRef } from "../navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { updateAddresses } from "../service/firestore.service";
import { updateEmail } from "../service/firestore.service";
import { Alert } from "react-native";
//import { saveCardRequest } from "../service/checkout.service";

export const AuthenticationContextCustomer = createContext();

export const AuthenticationContextProviderCustomer = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  // const [paymentCards, setPaymentCards] = useState([]);
  const [user, setUser] = useState({
    phone: null,
    name: null,
    profilePicture: null,
    email: null,
    homeAddress: null,
    officeAddress: null,
    stripeId: null,
    isAuthenticated: false,
  });
  const [homeAddress, setHomeAddress] = useState(user.homeAddress);
  const [officeAddress, setOfficeAddress] = useState(user.officeAddress);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailUpdateFailed, setEmailUpdateFailed] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [orderStage, setOrderStage] = useState("");

  const recaptchaVerifier = useRef(null);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (user && Object.keys(user).length > 0 && user.phone) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser !== null) {
          const parsedUser = JSON.parse(storedUser);
          if (
            parsedUser.phone &&
            parsedUser.name &&
            parsedUser.profilePicture &&
            parsedUser.email &&
            parsedUser.homeAddress &&
            parsedUser.officeAddress &&
            parsedUser.stripeId
          ) {
            setUser(parsedUser);
            setIsAuthenticated(true);
            setProfilePictureURL(parsedUser.profilePicture);
            setHomeAddress(parsedUser.homeAddress);
            setOfficeAddress(parsedUser.officeAddress);
          }
        }
        const storedProfilePictureURL = await AsyncStorage.getItem(
          "profilePictureURL"
        );
        if (storedProfilePictureURL !== null) {
          setProfilePictureURL(storedProfilePictureURL);
        }
      } catch (error) {
        // Handle error
        console.error(error);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (usr && usr.phone != null) {
        setIsLoading(true);
        try {
          const userDoc = await getDocs(
            query(collection(db, "users"), where("phone", "==", usr.phone))
          );
          const userData = userDoc.docs[0]?.data();
          if (userData && userData.role === "user") {
            setUser({
              phone: usr.phone,
              name: userData.username,
              profilePicture: userData.profilePicture,
              email: userData.email,
              homeAddress: userData.homeAddress,
              officeAddress: userData.officeAddress,
              stripeId: userData.stripeId,
            });
            setProfilePictureURL(userData.profilePicture);
            setIsAuthenticated(true);
            setHomeAddress(userData.homeAddress);
            setOfficeAddress(userData.officeAddress);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        }
      } else {
        setUser({});
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setHomeAddress(user.homeAddress);
    setOfficeAddress(user.officeAddress);
  }, [user.homeAddress, user.officeAddress]);

  const onUserAuthenticated = (userData) => {
    setUser({
      phone: userData.phone,
      name: userData.username,
      email: userData.email,
      profilePicture: userData.profilePicture,
      homeAddress: userData.homeAddress,
      officeAddress: userData.officeAddress,
      stripeId: userData.stripeId,
      isAuthenticated: true,
    });
    setIsAuthenticated(true);
    setProfilePictureURL(userData.profilePicture);
    setHomeAddress(userData.homeAddress);
    setOfficeAddress(userData.officeAddress);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigationRef.current?.navigate("MyTabs");
    }
  }, [isAuthenticated]);

  const isUserRegistered = async (phoneNumber) => {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(
      query(usersCollection, where("phone", "==", phoneNumber))
    );
    return !querySnapshot.empty;
  };

  const addOrUpdateAddress = async (type, address) => {
    try {
      const updatedUser = { ...user, [type]: address };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      await updateAddresses(
        user.phone,
        updatedUser.homeAddress,
        updatedUser.officeAddress
      );
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const addOrUpdateEmail = async (newEmail) => {
    try {
      const updateSuccess = await updateEmail(newEmail, user.phone);
      if (updateSuccess) {
        const updatedUser = { ...user, email: newEmail };
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setEmailUpdateFailed(false);
        return true;
      } else {
        setEmailUpdateFailed(true);
        return false;
      }
    } catch (error) {
      console.error("Error updating email:", error);
      Alert.alert("Update Failed");
      setEmailUpdateFailed(true);
      return false;
    }
  };

  useEffect(() => {
    if (emailUpdateFailed) {
      (async () => {
        try {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser !== null) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.email) {
              setUser((prevUser) => ({ ...prevUser, email: parsedUser.email }));
            }
          }
        } catch (error) {
          console.error(error);
        }
        setEmailUpdateFailed(false);
      })();
    }
  }, [emailUpdateFailed]);

  useEffect(() => {
    if (profilePictureURL) {
      AsyncStorage.setItem("profilePictureURL", profilePictureURL);
    }
  }, [profilePictureURL]);

  useEffect(() => {
    if (!currentOrderId) {
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "purchases", currentOrderId),
      (doc) => {
        const updatedPurchase = doc.data();
        console.log("Current data: ", updatedPurchase?.orderStatus);

        if (updatedPurchase?.orderStatus === true) {
          console.log("orderStatus changed");
        }
      }
    );
    return () => unsubscribe();
  }, [currentOrderId]);

  const onLogin = async (phoneNumber, navigation) => {
    setIsLoading(true);
    clearError();

    try {
      const isRegistered = await isUserRegistered(phoneNumber);
      if (isRegistered) {
        const userDoc = await getDocs(
          query(collection(db, "users"), where("phone", "==", phoneNumber))
        );
        const userData = userDoc.docs[0].data();

        setUser({
          phone: phoneNumber,
          name: userData.username,
          profilePicture: userData.profilePicture,
          email: userData.email,
          homeAddress: userData.homeAddress,
          officeAddress: userData.officeAddress,
          stripeId: userData.stripeId,
        });
        setIsAuthenticated(true);
        setProfilePictureURL(userData.profilePicture);
        setHomeAddress(userData.homeAddress);
        setOfficeAddress(userData.officeAddress);
      } else {
        Alert.alert(
          "Number not registered",
          "Register now?",
          [
            {
              text: "No",
              onPress: () => console.log("User cancelled"),
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                try {
                  const phoneProvider = new PhoneAuthProvider(auth);
                  const verification = await phoneProvider.verifyPhoneNumber(
                    phoneNumber,
                    recaptchaVerifier.current
                  );
                  navigation.navigate("AccountNavigator", {
                    screen: "VerificationCodeCustomer",
                    params: {
                      verificationId: verification,
                      phoneNumber: phoneNumber,
                    },
                  });
                } catch (error) {
                  setError(`Error : ${error.message}`);
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (e) {
      console.error("Error:", e);
      setError(e.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const onLogout = (navigation) => {
    signOut(auth)
      .then(() => {
        AsyncStorage.removeItem("user")
          .then(() => {
            setUser({});
            setIsAuthenticated(false);
            navigation.navigate("Main");
            setError(null);
          })
          .catch((error) => {
            console.error("AsyncStorage error:", error);
          });
      })
      .catch((error) => {
        console.error("SignOut error:", error);
      });
  };

  const recheckAuthentication = async (phoneNumber) => {
    const isRegistered = await isUserRegistered(phoneNumber);
    if (isRegistered) {
      const userDoc = await getDocs(
        query(collection(db, "users"), where("phone", "==", phoneNumber))
      );
      const userData = userDoc.docs[0].data();
      onUserAuthenticated(userData);
    }
  };

  return (
    <AuthenticationContextCustomer.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        setIsLoading,
        error,
        onLogin,
        onLogout,
        onUserAuthenticated,
        profilePictureURL,
        setProfilePictureURL,
        addOrUpdateAddress,
        addOrUpdateEmail,
        homeAddress,
        setHomeAddress,
        officeAddress,
        setOfficeAddress,
        setCurrentOrderId,
        currentOrderId,
        orderStage,
        setOrderStage,
        recheckAuthentication,
      }}
    >
      {children}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
      />
    </AuthenticationContextCustomer.Provider>
  );
};
