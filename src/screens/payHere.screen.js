import React, { useContext, useState, useEffect } from "react";
//import { Text } from "../styles/text.styles";
import {
  Keyboard,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import LottieView from "lottie-react-native";
import { TabLink } from "../stylings/restaurant-info.styles";
import { PayButton } from "../stylings/checkout.styles";
import { colors } from "../styles/colors.styles";
import { NairaIcon } from "./restaurant-detail.screen";
import { CreditCardInput } from "../features/credit-card.component";
import { CartContext } from "../context/cart.context";
import { Spacer } from "../styles/spacer.styles";
import { List, Divider, Button, DataTable } from "react-native-paper";
import { RestaurantInfo } from "../features/restaurant-info";
import { payRequest } from "../service/checkout.service";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { addPurchaseToFirestore } from "../service/firestore.service";
import { AnimationWrapper } from "../stylings/account.styles";
import { Animations } from "../animations";

const formatPrice = (price) => {
  return (price / 100).toFixed(0);
};

const formatAddress = (address) => {
  const countryToRemove = "Nigeria";
  if (address.endsWith(countryToRemove)) {
    return address.substring(0, address.length - countryToRemove.length).trim();
  }
  return address;
};

const PaySuccess = ({ isVisible }) => {
  return (
    <Modal animationType="slide" transparent={false} visible={isVisible}>
      <View style={styles.centeredView}>
        <AnimationWrapper>
          <LottieView
            source={Animations.SuccessPay}
            autoPlay={true}
            loop={true}
            resizeMode="cover"
          />
        </AnimationWrapper>
        <Text style={styles.modalText}>Payment Successful! redirecting...</Text>
        <ActivityIndicator size="small" color="green" />
      </View>
    </Modal>
  );
};

export const PayScreen = ({ navigation, route }) => {
  const {
    clearCart,
    cart,
    sum,
    ridersNote,
    restaurantNote,
    setRestaurantNote,
    setRidersNote,
  } = useContext(CartContext);
  const { address, restaurant, deliveryFee } = route.params;
  const { user, isLoading, setIsLoading, setCurrentOrderId } = useContext(
    AuthenticationContextCustomer
  );
  const [card, setCard] = useState(null);
  const [showRestaurantInfo, setShowRestaurantInfo] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const name = user.name;
  const VAT = 0;
  const totalToPay = (
    parseInt(sum, 10) +
    parseInt(deliveryFee, 10) +
    parseInt(VAT, 10)
  ).toFixed(2);
  const totalToPayInKobo = totalToPay * 100;
  const formattedAddress = formatAddress(address);

  const uniqueItems = Array.from(new Set(cart.map((item) => item.item)));

  const itemCountInCart = (itemTitle) => {
    return cart.filter((item) => item.item === itemTitle).length;
  };

  const onPay = () => {
    setIsLoading(true);
    const uniqueItemsWithCount = uniqueItems.map((item) => ({
      product: item,
      quantity: itemCountInCart(item),
    }));

    if (!card || !card.id) {
      setIsLoading(false);
      Alert.alert(
        "Payment Error",
        "Problem with payment, try again or use a different card"
      );
      return;
    }

    payRequest(card.id, totalToPayInKobo, name)
      .then((result) => {
        addPurchaseToFirestore(
          user.name,
          formattedAddress,
          user.phone,
          restaurant,
          uniqueItemsWithCount,
          restaurantNote,
          ridersNote,
          deliveryFee
        ).then((newOrderId) => {
          if (newOrderId) {
            setShowModal(true);
            setTimeout(() => {
              setShowModal(false);
              setIsLoading(false);
              clearCart();
              setCurrentOrderId(newOrderId);
              setRestaurantNote(null);
              setRidersNote(null);
              navigation.navigate("CheckoutSuccess", { restaurant });
            }, 2000);
          } else {
            setIsLoading(false);
          }
        });
      })
      .catch((err) => {
        setIsLoading(false);
        Alert.alert(
          "Payment Error",
          "Problem with payment, try again or use a different card"
        );
      });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setShowRestaurantInfo(false)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setShowRestaurantInfo(true)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <TabLink>
      {showRestaurantInfo && <RestaurantInfo restaurant={restaurant} />}
      <Spacer position="top" size="large" />
      <Divider />
      <DataTable>
        <DataTable.Row>
          <DataTable.Cell>Order Price:</DataTable.Cell>
          <DataTable.Cell numeric>{`₦${sum}`}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Delivery Address:</DataTable.Cell>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Text numberOfLines={2} ellipsizeMode="tail">
              {address}
            </Text>
          </View>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Delivery Fee:</DataTable.Cell>
          <DataTable.Cell numeric>{`₦${deliveryFee}`}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>VAT:</DataTable.Cell>
          <DataTable.Cell numeric>{`₦${VAT}`}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row>
          <DataTable.Cell>Total To Pay:</DataTable.Cell>
          <DataTable.Cell numeric>{`₦${totalToPay}`}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <Divider />
      <Spacer position="top" size="large">
        <Text>Enter Payment Card Details</Text>
        {address && (
          <>
            <CreditCardInput
              name={name}
              onSuccess={setCard}
              onError={() =>
                navigation.navigate("CheckoutError", {
                  error: "Something went wrong processing your card",
                })
              }
            />
          </>
        )}
      </Spacer>
      {showModal && <PaySuccess isVisible={showModal} />}
      <Spacer position="top" size="large" />
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.brand.primary} />
      ) : (
        <PayButton
          disabled={isLoading}
          icon={NairaIcon}
          mode="contained"
          onPress={onPay}
        >
          Pay
        </PayButton>
      )}
    </TabLink>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF", // You can choose a background color here
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  input: {
    width: 200,
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 20,
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
