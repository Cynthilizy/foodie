import React, { useState, createContext, useEffect, useRef } from "react";
import { navigationRef } from "../navigation";
import { db, auth, app } from "../service/firebase.service";
import { signOut, onAuthStateChanged, PhoneAuthProvider } from "firebase/auth";
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
import { updateEmailRider } from "../service/firestore.service";
import { Alert } from "react-native";

export const AuthenticationContextRider = createContext();

export const AuthenticationContextProviderRider = ({ children }) => {
  const [isLoadingRider, setIsLoadingRider] = useState(false);
  const [profilePicUrlRider, setProfilePicUrlRider] = useState(null);
  const [rider, setRider] = useState({
    phoneRider: null,
    nameRider: null,
    profilePictureRider: null,
    emailRider: null,
    riderStatus: "",
    riderOnline: false,
    isAuthenticatedRider: false,
  });
  const [error, setError] = useState(null);
  const [isAuthenticatedRider, setIsAuthenticatedRider] = useState(false);
  const [orderStage, setOrderStage] = useState("");
  const [emailRiderUpdateFailed, setEmailRiderUpdateFailed] = useState(false);
  const [incomingOrdersRider, setIncomingOrdersRider] = useState([]);
  const [ongoingOrdersRider, setOngoingOrdersRiders] = useState([]);
  const recaptchaVerifier = useRef(null);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    async function fetchData() {
      if (rider && Object.keys(rider).length > 0 && rider.phoneRider) {
        await AsyncStorage.setItem("rider", JSON.stringify(rider));
        console.log("rider added to async", rider);
      }
    }
    fetchData();
  }, [rider]);

  useEffect(() => {
    const getRiderData = async () => {
      try {
        const storedRider = await AsyncStorage.getItem("rider");
        if (storedRider !== null) {
          const parsedRider = JSON.parse(storedRider);
          console.log("parsed rider", parsedRider);
          if (
            parsedRider.phoneRider &&
            parsedRider.nameRider &&
            parsedRider.profilePictureRider &&
            parsedRider.emailRider &&
            parsedRider.riderStatus &&
            parsedRider.riderOnline
          ) {
            setRider(parsedRider);
            setIsAuthenticatedRider(true);
            setProfilePicUrlRider(parsedRider.profilePictureRider);
          }
        }
        const storedprofilePicUrlRider = await AsyncStorage.getItem(
          "profilePicUrlRider"
        );
        if (storedprofilePicUrlRider !== null) {
          setProfilePicUrlRider(storedprofilePicUrlRider);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getRiderData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (rdr) => {
      if (rdr && rdr.phoneRider != null) {
        setIsLoadingRider(true);
        try {
          const riderDoc = await getDocs(
            query(
              collection(db, "riders"),
              where("phoneRider", "==", rdr.phoneRider)
            )
          );
          const riderData = riderDoc.docs[0]?.data();
          if (riderData && riderData.role === "rider") {
            setRider({
              phoneRider: rdr.phoneRider,
              nameRider: riderData.nameRider,
              profilePictureRider: riderData.profilePictureRider,
              emailRider: riderData.emailRider,
              riderStatus: riderData.riderStatus,
              riderOnline: riderData.riderOnline,
            });
            setRiderStatus(riderData.riderStatus);
            setProfilePicUrlRider(riderData.profilePictureRider);
            setIsAuthenticatedRider(true);
          }
          setIsLoadingRider(false);
        } catch (errorRider) {
          console.error("errorRider fetching user data:", error);
          setIsLoadingRider(false);
        }
      } else {
        setRider({});
        setIsAuthenticatedRider(false);
        setIsLoadingRider(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const onRiderAuthentication = (riderData) => {
    setRider({
      phoneRider: riderData.phoneRider,
      nameRider: riderData.nameRider,
      emailRider: riderData.emailRider,
      profilePictureRider: riderData.profilePictureRider,
      riderStatus: riderData.riderStatus,
      riderOnline: riderData.riderOnline,
      isAuthenticatedRider: true,
    });
    setIsAuthenticatedRider(true);
    setProfilePicUrlRider(riderData.profilePictureRider);
  };

  const isRiderRegistered = async (phoneRiderNumber) => {
    const ridersCollection = collection(db, "riders");
    const querySnapshot = await getDocs(
      query(ridersCollection, where("phoneRider", "==", phoneRiderNumber))
    );
    return !querySnapshot.empty;
  };

  const UpdateEmailRider = async (newEmailRider) => {
    try {
      const updateSuccess = await updateEmailRider(
        newEmailRider,
        rider.phoneRider
      );
      if (updateSuccess) {
        const updatedRider = { ...rider, emailRider: newEmailRider };
        setRider(updatedRider);
        await AsyncStorage.setItem("rider", JSON.stringify(updatedRider));
        setEmailRiderUpdateFailed(false);
        return true;
      } else {
        setEmailRiderUpdateFailed(true);
        return false;
      }
    } catch (errorRider) {
      console.error("errorRider updating emailRider:", error);
      Alert.alert("Update Failed");
      setEmailRiderUpdateFailed(true);
      return false;
    }
  };

  useEffect(() => {
    if (emailRiderUpdateFailed) {
      (async () => {
        try {
          const storedRider = await AsyncStorage.getItem("rider");
          if (storedRider !== null) {
            const parsedRider = JSON.parse(storedRider);
            if (parsedRider.emailRider) {
              setRider((prevRider) => ({
                ...prevRider,
                emailRider: parsedRider.emailRider,
              }));
            }
          }
        } catch (error) {
          console.error(error);
        }
        setEmailRiderUpdateFailed(false);
      })();
    }
  }, [emailRiderUpdateFailed]);

  useEffect(() => {
    if (profilePicUrlRider) {
      AsyncStorage.setItem("profilePicUrlRider", profilePicUrlRider);
    }
  }, [profilePicUrlRider]);

  const onLoginRider = async (phoneRiderNumber, navigation) => {
    setIsLoadingRider(true);
    clearError();

    try {
      const isRegisteredRider = await isRiderRegistered(phoneRiderNumber);
      if (isRegisteredRider) {
        const riderDoc = await getDocs(
          query(
            collection(db, "riders"),
            where("phoneRider", "==", phoneRiderNumber)
          )
        );
        const riderData = riderDoc.docs[0].data();

        setRider({
          phoneRider: phoneRiderNumber,
          nameRider: riderData.nameRider,
          profilePictureRider: riderData.profilePictureRider,
          emailRider: riderData.emailRider,
          riderStatus: riderData.riderStatus,
          riderOnline: riderData.riderOnline,
        });
        setIsAuthenticatedRider(true);
        setProfilePicUrlRider(riderData.profilePictureRider);
      } else {
        Alert.alert(
          "Number not registered",
          "Register now?",
          [
            {
              text: "No",
              onPress: () => console.log("Rider cancelled"),
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: async () => {
                try {
                  const phoneRiderProvider = new PhoneAuthProvider(auth);
                  const verificationRider =
                    await phoneRiderProvider.verifyPhoneNumber(
                      phoneRiderNumber,
                      recaptchaVerifier.current
                    );
                  navigation.navigate("AccountNavigator", {
                    screen: "VerificationCodeRider",
                    params: {
                      verificationRiderId: verificationRider,
                      phoneRiderNumber,
                    },
                  });
                } catch (errorRider) {
                  setError(`errorRider : ${errorRider.message}`);
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (e) {
      console.error("errorRider:", e);
      setError(e.toString());
    } finally {
      setIsLoadingRider(false);
    }
  };

  const onLogoutRider = (navigation) => {
    signOut(auth)
      .then(() => {
        AsyncStorage.getItem("rider")
          .then((riderData) => {
            console.log("Rider data in Logout function:", riderData);
            if (riderData !== null) {
              console.log("Rider data before removing:", riderData);
              AsyncStorage.removeItem("rider")
                .then(() => {
                  console.log("Rider data after removal:", riderData);
                  setRider({});
                  setIsAuthenticatedRider(false);
                  navigation.navigate("Main");
                  setError(null);
                })
                .catch((error) => {
                  console.error("AsyncStorage error:", error);
                });
            } else {
              console.log("No rider data found in AsyncStorage.");
            }
          })
          .catch((error) => {
            console.error("AsyncStorage getItem error:", error);
          });
      })
      .catch((signOutError) => {
        console.error("SignOut error:", signOutError);
      });
  };

  const recheckAuthenticationRider = async (phoneNumber) => {
    const isRegisteredRider = await isRiderRegistered(phoneNumber);
    if (isRegisteredRider) {
      const riderDoc = await getDocs(
        query(collection(db, "riders"), where("phoneRider", "==", phoneNumber))
      );
      const riderData = riderDoc.docs[0].data();
      onRiderAuthentication(riderData);
    }
  };

  useEffect(() => {
    if (rider && rider.phoneRider) {
      const q = query(
        collection(db, "riders"),
        where("phoneRider", "==", rider.phoneRider)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedRider = snapshot.docs[0]?.data();
        if (fetchedRider && fetchedRider.riderStatus !== rider.riderStatus) {
          setRider((prevRider) => ({
            ...prevRider,
            riderStatus: fetchedRider.riderStatus,
          }));
        }
      });
      return () => unsubscribe();
    }
  }, [rider]);

  useEffect(() => {
    if (rider && rider.phoneRider) {
      const riderDocRef = doc(db, "riders", rider.phoneRider);

      const unsubscribe = onSnapshot(riderDocRef, (snapshot) => {
        const fetchedRider = snapshot.data();
        if (fetchedRider && fetchedRider.riderOnline !== rider.riderOnline) {
          setRider((prevRider) => ({
            ...prevRider,
            riderOnline: fetchedRider.riderOnline,
          }));
        }
      });
      return () => unsubscribe();
    }
  }, [rider.riderOnline]);

  useEffect(() => {
    if (rider.riderStatus === "Pending") {
      navigationRef.current?.navigate("AccountNavigator", {
        screen: "Verifying",
      });
    } else if (rider.riderStatus === "Rejected") {
      navigationRef.current?.navigate("AccountNavigator", {
        screen: "Rejected",
      });
    } else if (rider.riderStatus === "Accepted") {
      navigationRef.current?.navigate("MyRiderTabs");
    }
  }, [rider.riderStatus]);

  return (
    <AuthenticationContextRider.Provider
      value={{
        isAuthenticatedRider,
        rider,
        isLoadingRider,
        setIsLoadingRider,
        error,
        onLoginRider,
        onLogoutRider,
        onRiderAuthentication,
        profilePicUrlRider,
        setProfilePicUrlRider,
        UpdateEmailRider,
        orderStage,
        setOrderStage,
        incomingOrdersRider,
        setIncomingOrdersRider,
        ongoingOrdersRider,
        setOngoingOrdersRiders,
        recheckAuthenticationRider,
        setError,
      }}
    >
      {children}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleverificationRider={true}
      />
    </AuthenticationContextRider.Provider>
  );
};
