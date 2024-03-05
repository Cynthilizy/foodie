import React, { useContext, useState, useEffect, useRef } from "react";
import { Platform, View, TouchableOpacity, Text, Animated } from "react-native";
import MapView, { Marker } from "react-native-maps";
import styled from "styled-components/native";
import { SearchMap } from "./mapSearch.screen";
import * as Location from "expo-location";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../service/firebase.service";
import { colors } from "../styles/colors.styles";
import { Spacer } from "../styles/spacer.styles";
import Swipeout from "react-native-swipeout";
import { addDeliveredMeal } from "../service/firestore.service";

const Map = styled(MapView)`
  height: 100%;
  width: 100%;
`;

const OnlineContainer = styled(View)`
  position: absolute;
  bottom: 70px;
  left: 150px;
  z-index: 10;
`;

const OnlineButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.ui.primary};
  padding: 15px 30px;
  border-radius: 30px;
  margin-left: 50px;
`;

const ButtonText = styled(Text)`
  color: ${(props) => props.theme.colors.ui.quaternary};
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  letter-spacing: 1.2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const SwitchContainer = styled(Animated.View)`
  background-color: ${(props) => props.theme.colors.ui.primary};
  border-radius: 30px;
  shadow-opacity: 0.3;
  shadow-radius: 3px;
  border: 2px solid #333;
  width: 300px;
  height: 60px;
`;

const StatusHeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-right: 10px;
  background-color: rgba(240, 240, 240, 0.8);
  padding: 5px 10px;
  border-radius: 15px;
`;

export const MapScreen = ({ navigation }) => {
  const { rider, isLoadingRider, setIsLoadingRider } = useContext(
    AuthenticationContextRider
  );
  const [region, setRegion] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [isOnline, setIsOnline] = useState(rider.riderOnline);
  const [isSwipeoutOpen, setIsSwipeoutOpen] = useState(false);
  const ARROW_COUNT = 5; // number of arrows
  const ARROW_DELAY = 2000 / ARROW_COUNT; // Ensuring the entire sequence lasts 2 seconds
  const arrowAnim = useRef(new Animated.Value(0)).current;

  const swipeoutRef = useRef(null);
  const swipeoutBtns = {
    left: [
      {
        text: "Online",
        backgroundColor: "green",
        onPress: () => {
          if (!isOnline) toggleOnlineStatus();
        },
      },
    ],
    right: [
      {
        text: "Offline",
        backgroundColor: "red",
        onPress: () => {
          if (isOnline) toggleOnlineStatus();
        },
      },
    ],
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
      if (locationSubscription) {
        locationSubscription.remove();
      }
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      );
      setLocationSubscription(subscription);
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  const animateArrow = () => {
    Animated.sequence([
      Animated.timing(arrowAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(arrowAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(animateArrow);
  };

  useEffect(() => {
    animateArrow();
  }, []);

  const arrowTranslates = Array.from({ length: ARROW_COUNT }).map(
    () => useRef(new Animated.Value(0)).current
  );

  const arrowOpacities = Array.from({ length: ARROW_COUNT }).map(
    () => useRef(new Animated.Value(1)).current
  );

  const animateSingleArrow = (translate, opacity) => {
    Animated.parallel([
      Animated.timing(translate, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      translate.setValue(0);
      opacity.setValue(1);
      animateSingleArrow(translate, opacity);
    });
  };

  const animateAllArrows = () => {
    arrowTranslates.forEach((translate, index) => {
      setTimeout(() => {
        animateSingleArrow(translate, arrowOpacities[index]);
      }, ARROW_DELAY * index);
    });
  };

  useEffect(() => {
    animateAllArrows();
  }, []);

  const renderArrows = () => {
    const arrowDirection = isOnline ? [-1, 1] : [1, -1];
    return Array.from({ length: ARROW_COUNT }).map((_, index) => {
      const translateX = arrowTranslates[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60 * arrowDirection[0]],
      });

      const arrowStartingPoint = isOnline
        ? 60 * (ARROW_COUNT - 1 - index)
        : 60 * index;

      return (
        <Animated.View
          key={index}
          style={{
            position: "absolute",
            opacity: arrowOpacities[index],
            transform: [{ translateX: translateX }],
            left: arrowStartingPoint,
            marginTop: 30,
          }}
        >
          {!isOnline ? (
            <Icon name="arrow-right" size={24} color={colors.ui.quaternary} />
          ) : (
            <Icon name="arrow-left" size={24} color={colors.ui.quaternary} />
          )}
        </Animated.View>
      );
    });
  };
  const toggleOnlineStatus = async () => {
    const newOnlineStatus = !isOnline;
    setIsOnline(newOnlineStatus);
    try {
      const riderOnlineDocRef = doc(db, "riders", rider.phoneRider);
      await updateDoc(riderOnlineDocRef, {
        riderOnline: newOnlineStatus,
      });
      console.log("rider is online? ", newOnlineStatus);
      if (isSwipeoutOpen && swipeoutRef.current) {
        swipeoutRef.current._close();
        setIsSwipeoutOpen(false);
      }
      return true;
    } catch (error) {
      console.error("Error updating online status:", error);
      return false;
    }
  };

  const renderOnlineToggle = () => {
    if (Platform.OS === "ios") {
      return (
        <Swipeout
          ref={swipeoutRef}
          left={swipeoutBtns.left}
          right={swipeoutBtns.right}
          autoClose={true}
          backgroundColor="transparent"
          onOpen={(arg1, arg2, direction) => {
            setIsSwipeoutOpen(true);

            const closeSwipeout = () => {
              setTimeout(() => {
                if (swipeoutRef.current) {
                  swipeoutRef.current._close();
                }
              }, 100); // Close after 100ms
            };

            if (direction === "right") {
              if (isOnline) {
                toggleOnlineStatus();
              } else {
                closeSwipeout();
              }
            }

            if (direction === "left") {
              if (!isOnline) {
                toggleOnlineStatus();
              } else {
                closeSwipeout();
              }
            }
          }}
        >
          <SwitchContainer>
            {isOnline ? (
              <ButtonText>Swipe left to go offline</ButtonText>
            ) : (
              <ButtonText>Swipe Right to go online</ButtonText>
            )}
            {renderArrows()}
          </SwitchContainer>
        </Swipeout>
      );
    } else {
      return (
        <OnlineButton onPress={toggleOnlineStatus}>
          <ButtonText>{isOnline ? "Go Offline" : "Go Online"}</ButtonText>
        </OnlineButton>
      );
    }
  };

  useEffect(() => {
    if (rider && rider.phoneRider) {
      const riderDocRef = doc(db, "riders", rider.phoneRider);
      const unsubscribe = onSnapshot(riderDocRef, (doc) => {
        if (doc.exists) {
          setIsOnline(doc.data().riderOnline);
        }
      });
      return () => {
        unsubscribe();
      };
    } else {
      setIsOnline(false);
    }
  }, [rider]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <StatusHeaderContainer>
          <Icon name="circle" size={24} color={isOnline ? "green" : "red"} />
          <Text
            style={{
              marginLeft: 8,
              marginRight: 8, // added right margin
              fontWeight: "bold",
              color: isOnline ? "green" : "red",
            }}
          >
            {isOnline ? "Online" : "Offline"}
          </Text>
        </StatusHeaderContainer>
      ),
    });
  }, [isOnline, navigation]);

  return (
    <>
      <SearchMap />
      <Map
        provider={Platform.OS === "android" ? "google" : "google"}
        region={region}
      >
        {region && (
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          >
            <Icon name="bike" size={40} color="black" />
          </Marker>
        )}
      </Map>
      <OnlineContainer style={{ transform: [{ translateX: -100 }] }}>
        {renderOnlineToggle()}
      </OnlineContainer>
    </>
  );
};
