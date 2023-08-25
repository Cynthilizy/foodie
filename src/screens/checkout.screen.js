import React, { useContext, useState } from "react";
import { Text } from "../styles/text.styles";
import { View, TouchableOpacity } from "react-native";
import { TabLink } from "../stylings/restaurant-info.styles";
import { addPurchaseToFirestore } from "../utils/controller-firestore";
import {
  CartIcon,
  CartIconContainer,
  NameInput,
  PayButton,
  ClearButton,
  PaymentProcessing,
} from "../stylings/checkout.styles";
import { colors } from "../styles/colors.styles";
import { NairaIcon } from "./restaurant-detail.screen";
import { CreditCardInput } from "../features/credit-card.component";
import { CartContext } from "../context/cart.context";
import { Spacer } from "../styles/spacer.styles";
import { ScrollView } from "react-native";
import { List, Divider, Button, DataTable } from "react-native-paper";
import { RestaurantInfo } from "../features/restaurant-info";
import { payRequest } from "../service/checkout.service";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
//import { Table, Row, Cell } from "react-native-table-component";

const PlusMinusButtons = ({ onMinus, onPlus }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity onPress={onMinus}>
      <Icon name="minus" size={20} color={colors.brand.primary} />
    </TouchableOpacity>
    <Spacer position="right" size="large"></Spacer>
    <TouchableOpacity onPress={onPlus}>
      <Icon name="plus" size={20} color={colors.brand.primary} />
    </TouchableOpacity>
  </View>
);

export const CheckoutScreen = ({ navigation }) => {
  const {
    cart,
    restaurant,
    clearCart,
    sum,
    addToCart,
    removeOneTitle,
    removeFromCart,
    selectedTitle,
    setSelectedTitle,
  } = useContext(CartContext);
  console.log("selected title in checkout", selectedTitle);
  const [name, setName] = useState("");
  const [card, setCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onPay = () => {
    setIsLoading(true);
    if (!card || !card.id) {
      setIsLoading(false);
      navigation.navigate("CheckoutError", {
        error: "Please fill in a valid credit card",
      });
      return;
    }
    payRequest(card.id, sum, name)
      .then((result) => {
        setIsLoading(false);
        clearCart();
        navigation.navigate("CheckoutSuccess");
      })
      .catch((err) => {
        setIsLoading(false);
        navigation.navigate("CheckoutError", {
          error: err,
        });
      });
  };

  if (!cart.length || !restaurant) {
    return (
      <TabLink>
        <CartIconContainer>
          <CartIcon icon="cart-off" />
          <Text>Your cart is empty!</Text>
        </CartIconContainer>
      </TabLink>
    );
  }

  const itemCountInCart = (itemTitle) => {
    return cart.filter((item) => item.item === itemTitle).length;
  };

  const getTitleWithCount = (item, price) => {
    const itemCartCount = itemCountInCart(item);
    const isMainOrExtraMeal = selectedTitle.some(
      (title) => title === item || `extra ${title}` === item
    );
    const isMainMeal = selectedTitle.some((title) => title === item);
    const isExtraMeal = selectedTitle.some(
      (title) => `extra ${title}` === item
    );

    return (
      <DataTable.Row key={item}>
        <DataTable.Cell style={{ flex: 2 }}>{item}</DataTable.Cell>
        <DataTable.Cell>{`₦${price / 100}`}</DataTable.Cell>
        <DataTable.Cell>{`x ${itemCountInCart(item)}`}</DataTable.Cell>
        <DataTable.Cell>
          {isMainMeal && (
            <Button
              icon={({ size, color }) => (
                <Icon name="delete" size={size} color={colors.ui.error} />
              )}
              onPress={() => {
                removeFromCart(item);
                removeFromCart(`extra ${item}`);
                setSelectedTitle((prevSelectedTitle) =>
                  prevSelectedTitle.filter((title) => title !== item)
                );
              }}
            />
          )}

          {isExtraMeal && (
            <Button
              icon={({ size, color }) => (
                <Icon name="delete" size={size} color={colors.ui.error} />
              )}
              onPress={() => {
                removeFromCart(item);
              }}
            />
          )}

          {!isMainOrExtraMeal && (
            <PlusMinusButtons
              onMinus={() => {
                if (itemCartCount > 0) {
                  removeOneTitle(item);
                }
              }}
              onPlus={() => {
                addToCart({ item: item, price: price }, restaurant);
              }}
            />
          )}
        </DataTable.Cell>
      </DataTable.Row>
    );
  };

  const uniqueItems = Array.from(new Set(cart.map((item) => item.item)));

  return (
    <TabLink>
      <RestaurantInfo restaurant={restaurant} />
      {isLoading && <PaymentProcessing />}
      <ScrollView>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="large">
            <Text style={{ fontWeight: "bold" }}>Your Order</Text>
          </Spacer>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ flex: 2 }}>Item</DataTable.Title>
              <DataTable.Title>Price</DataTable.Title>
              <DataTable.Title></DataTable.Title>
              <DataTable.Title></DataTable.Title>
            </DataTable.Header>

            {uniqueItems.map((item, index) => {
              const price = cart.find(
                (cartItem) => cartItem.item === item
              ).price;
              return getTitleWithCount(item, price);
            })}

            <DataTable.Row>
              <DataTable.Cell style={{ flex: 1.5 }}>
                <Text variant="label" style={{ fontWeight: "bold" }}>
                  Total
                </Text>
              </DataTable.Cell>
              <DataTable.Cell numeric>
                <Text variant="label" style={{ fontWeight: "bold" }}>
                  ₦{(sum / 100).toFixed(2)}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell></DataTable.Cell>
              <DataTable.Cell></DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Spacer>
        <Spacer position="top" size="large" />
        <Divider />
        <NameInput
          label="Name"
          value={name}
          onChangeText={(t) => {
            setName(t);
          }}
        />
        <Spacer position="top" size="large">
          {name.length > 0 && (
            <CreditCardInput
              name={name}
              onSuccess={setCard}
              onError={() =>
                navigation.navigate("CheckoutError", {
                  error: "Something went wrong processing your credit card",
                })
              }
            />
          )}
        </Spacer>
        <Spacer position="top" size="xxl" />
        <PayButton
          disabled={isLoading}
          icon={NairaIcon}
          mode="contained"
          onPress={onPay}
        >
          Pay
        </PayButton>
        <Spacer position="top" size="large">
          <ClearButton
            disabled={isLoading}
            icon="cart-off"
            mode="contained"
            onPress={clearCart}
          >
            Clear Cart
          </ClearButton>
        </Spacer>
      </ScrollView>
    </TabLink>
  );
};
