import React, { useContext, useEffect, useState } from "react";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import {
  AccountContainer,
  AccountCover,
  AccountBackground,
} from "../stylings/account.styles";
import { Spacer } from "../styles/spacer.styles";
import LottieView from "lottie-react-native";
import { AnimationWrapper } from "../stylings/account.styles";
import { Animations } from "../animations";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { db } from "../service/firebase.service";
import { View } from "react-native";
import styled from "styled-components/native";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const Container = styled.View`
  background-color: rgba(255, 255, 255, 0.7);
  padding: ${(props) => props.theme.space[4]};
  margin-top: ${(props) => props.theme.space[2]};
`;

const StatusCircle = ({ isActive }) => (
  <View
    style={{
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: isActive ? "green" : "grey",
      margin: 5,
    }}
  />
);

const ProgressBar = ({ currentStage }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        flex: 1,
        height: 2,
        backgroundColor: "grey",
        alignSelf: "center",
        marginBottom: 10,
      }}
    />
    <View style={{ alignItems: "center" }}>
      <StatusCircle
        isActive={
          currentStage === "Accepted" ||
          currentStage === "Cooking" ||
          currentStage === "PickedUp" ||
          currentStage === "Delivered"
        }
      />
      <Text style={{ fontSize: 10 }}>Accepted</Text>
    </View>
    <View
      style={{
        flex: 1,
        height: 2,
        backgroundColor: "grey",
        alignSelf: "center",
        marginBottom: 10,
      }}
    />
    <View style={{ alignItems: "center" }}>
      <StatusCircle
        isActive={
          currentStage === "Cooking" ||
          currentStage === "PickedUp" ||
          currentStage === "Delivered"
        }
      />
      <Text style={{ fontSize: 10 }}>Cooking</Text>
    </View>
    <View
      style={{
        flex: 1,
        height: 2,
        backgroundColor: "grey",
        alignSelf: "center",
        marginBottom: 10,
      }}
    />
    <View style={{ alignItems: "center" }}>
      <StatusCircle
        isActive={currentStage === "PickedUp" || currentStage === "Delivered"}
      />
      <Text style={{ fontSize: 10 }}>Picked-Up</Text>
    </View>
    <View
      style={{
        flex: 1,
        height: 2,
        backgroundColor: "grey",
        alignSelf: "center",
        marginBottom: 10,
      }}
    />
  </View>
);

export const CheckoutSuccessScreen = ({ route, navigation }) => {
  const { orderStage, setOrderStage, currentOrderId } = useContext(
    AuthenticationContextCustomer
  );
  const { restaurant } = route.params;
  const [statusText, setStatusText] = useState(
    "Waiting for order confirmation"
  );
  const [currentAnimation, setCurrentAnimation] = useState(Animations.Queue);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "purchases", currentOrderId),
      (docSnap) => {
        if (docSnap.exists()) {
          setOrderStage(docSnap.data().kitchenStatus);
        }
      },
      (error) => {
        console.error("Error listening for order stage changes: ", error);
      }
    );
    if (orderStage === "Accepted") {
      setStatusText(`Your Order has been accepted by ${restaurant.name}`);
      setCurrentAnimation(Animations.Queue);
    } else if (orderStage === "Cooking") {
      setStatusText("Our Chef has started cooking your meal");
      setCurrentAnimation(Animations.Cooking);
    } else if (orderStage === "PickedUp") {
      setStatusText("Our Rider has picked up your meal");
      setCurrentAnimation(Animations.RiderComing);
    } else if (orderStage === "Delivered") {
      navigation.navigate("DeliveredScreen");
    } else if (orderStage === "pending") {
      setStatusText("Waiting for order confirmation");
      setCurrentAnimation(Animations.Queue);
    }
    return () => unsubscribe();
  }, [currentOrderId, orderStage]);

  return (
    <TabLink>
      <AccountCover />
      <View style={{ width: "100%", height: "45%", paddingTop: 30 }}>
        <LottieView
          source={currentAnimation}
          autoPlay={true}
          loop={true}
          resizeMode="cover"
        />
      </View>
      <Spacer position="top" size="xxl" />
      <Text variant="label" style={{ textAlign: "center" }}>
        {statusText}
      </Text>
      <Spacer position="top" size="large" />
      <ProgressBar currentStage={orderStage} />
    </TabLink>
  );
};
