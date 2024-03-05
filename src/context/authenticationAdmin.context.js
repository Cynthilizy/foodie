import React, { useState, createContext, useRef, useEffect } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  where,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { LoginRequest } from "../service/authenticationAdmin.service";
import { db, auth, app } from "../service/firebase.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigationRef } from "../navigation";
import { addToOngoingOrders } from "../service/firestore.service";
import { removeFromOngoingOrders } from "../service/firestore.service";

export const AuthenticationContextAdmin = createContext();

export const AuthenticationContextProviderAdmin = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [ongoingOrders, setOngoingOrders] = useState([]);
  const [ordersPond, setOrdersPond] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [rejectedOrders, setRejectedOrders] = useState(new Set());
  const [acceptedOrders, setAcceptedOrders] = useState(new Set());
  const [userAdmin, setUserAdmin] = useState({
    email: null,
    username: null,
    isAuthenticatedAdmin: false,
  });

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (userAdmin && Object.keys(userAdmin).length > 0 && userAdmin.email) {
      AsyncStorage.setItem("userAdmin", JSON.stringify(userAdmin));
    }
  }, [userAdmin]);

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const storedAdmin = await AsyncStorage.getItem("userAdmin");
        if (storedAdmin !== null) {
          const parsedUser = JSON.parse(storedAdmin);
          if (parsedUser.username && parsedUser.email) {
            setUserAdmin(parsedUser);
            setIsAuthenticatedAdmin(true);
          }
        }
      } catch (error) {
        // Handle error
        console.error(error);
      }
    };
    getAdminData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (usr && usr.email != null) {
        setIsLoading(true);
        try {
          const userDoc = await getDocs(
            query(collection(db, "staffs"), where("email", "==", usr.email))
          );
          const userData = userDoc.docs[0]?.data();
          if (userData && userData.role === "admin") {
            setUserAdmin({
              email: usr.email,
              username: userData.username,
            });
            setIsAuthenticatedAdmin(true);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoading(false);
        }
      } else {
        setUserAdmin({});
        setIsAuthenticatedAdmin(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const onUserAuthenticated = (userData) => {
    setUserAdmin({
      username: userData.username,
      email: userData.email,
      isAuthenticatedAdmin: true,
    });
    setIsAuthenticatedAdmin(true);
  };

  useEffect(() => {
    if (isAuthenticatedAdmin) {
      navigationRef.current?.navigate("MyAdminTabs");
    }
  }, [userAdmin]);

  const isUserRegistered = async (email) => {
    const usersCollection = collection(db, "staffs");
    const querySnapshot = await getDocs(
      query(usersCollection, where("email", "==", email))
    );
    return !querySnapshot.empty;
  };

  // Listen for updates on the purchases collection
  useEffect(() => {
    const q = query(collection(db, "purchases"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map((doc) => doc.data());
      setOrders(newOrders);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "deliveredOrders"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newDeliveries = snapshot.docs.map((doc) => doc.data());
      setDeliveredOrders(newDeliveries);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const newIncomingOrders = orders.filter(
        (order) => order.orderStatus === "pending"
      );
      setIncomingOrders(newIncomingOrders);

      const newOngoingOrders = orders.filter((order) =>
        ["Accepted", "Cooking", "Ready", "RiderAccepts", "PickedUp"].includes(
          order.kitchenStatus
        )
      );
      setOngoingOrders(newOngoingOrders);

      const pondOrders = orders.filter(
        (order) =>
          ["Cooking", "Ready"].includes(order.kitchenStatus) &&
          order.rider === "" &&
          !rejectedOrders.has(order.orderId)
      );
      setOrdersPond(pondOrders);
    }
  }, [orders, rejectedOrders]);

  const onLogin = async (email, password) => {
    setIsLoading(true);
    clearError();
    try {
      const isRegistered = await isUserRegistered(email);
      if (isRegistered) {
        LoginRequest(auth, email, password).then((u) => {
          const user = auth.currentUser;
          if (user) {
            setUserAdmin({
              username: user.displayName,
              email: user.email,
            });
            setIsAuthenticatedAdmin(true);
          }
        });
      } else {
        return;
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
        AsyncStorage.removeItem("userAdmin")
          .then(() => {
            setUserAdmin({});
            setIsAuthenticatedAdmin(false);
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

  const fetchMenuByRestaurantId = async (restaurantId) => {
    try {
      const restaurantDocRef = doc(db, "restaurants", restaurantId);
      const restaurantDoc = await getDoc(restaurantDocRef);

      if (restaurantDoc.exists()) {
        const restaurantData = restaurantDoc.data();
        const menuData = {
          mainMenu: restaurantData.menu,
          drinksMenu: restaurantData.drinksMenu,
          proteinMenu: restaurantData.proteinMenu,
          sidesMenu: restaurantData.sidesMenu,
          swallowMenu: restaurantData.swallowSelection,
        };
        return menuData;
      } else {
        console.log("Restaurant document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
      return null;
    }
  };
  return (
    <AuthenticationContextAdmin.Provider
      value={{
        isAuthenticatedAdmin,
        userAdmin,
        userAdmin,
        isLoading,
        error,
        onLogin,
        onLogout,
        orders,
        setOrders,
        incomingOrders,
        setIncomingOrders,
        ongoingOrders,
        setOngoingOrders,
        fetchMenuByRestaurantId,
        ordersPond,
        setOrdersPond,
        rejectedOrders,
        setRejectedOrders,
        acceptedOrders,
        setAcceptedOrders,
        deliveredOrders,
        setDeliveredOrders,
      }}
    >
      {children}
    </AuthenticationContextAdmin.Provider>
  );
};
