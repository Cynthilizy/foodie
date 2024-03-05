import React, { useContext, useState, useEffect } from "react";
import { Text } from "../styles/text.styles";
import { View, TouchableOpacity, TextInput, Modal } from "react-native";
import { TabLink } from "../stylings/restaurant-info.styles";
import { Keyboard } from "react-native";
import {
  CartIcon,
  CartIconContainer,
  AddressInput,
  PayButton,
  ClearButton,
} from "../stylings/checkout.styles";
import { colors } from "../styles/colors.styles";
import { NairaIcon } from "./restaurant-detail.screen";
import { CartContext } from "../context/cart.context";
import { Spacer } from "../styles/spacer.styles";
import { ScrollView } from "react-native";
import { List, Divider, Button, DataTable } from "react-native-paper";
import { RestaurantInfo } from "../features/restaurant-info";
import { placesRequest } from "../service/checkout.service";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { deliveryFeeRequest } from "../service/checkout.service";
import { GoToCartButton } from "../stylings/restaurant-list.styles";

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
    ridersNote,
    setRidersNote,
  } = useContext(CartContext);
  const { user, isLoading, setIsLoading } = useContext(
    AuthenticationContextCustomer
  );
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [tempAddress, setTempAddress] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [isAddressSelected, setIsAddressSelected] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState(null);

  const name = user.name;
  const keyboardSetting = suggestions.length > 0 ? "always" : "never";

  const fetchAddressSuggestions = async () => {
    try {
      const response = await placesRequest(tempAddress);
      if (response && response.predictions) {
        setSuggestions(response.predictions);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  useEffect(() => {
    if (tempAddress) {
      fetchAddressSuggestions();
    }
  }, [tempAddress]);

  useEffect(() => {
    if (selectedAddress) {
      Keyboard.dismiss();
      fetchDeliveryFee();
    }
  }, [selectedAddress]);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsAddressSelected(true);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const fetchDeliveryFee = async () => {
    try {
      const fee = await deliveryFeeRequest(null, selectedAddress);
      setDeliveryFee(fee);
    } catch (error) {
      console.error("Error fetching delivery fee:", error);
    }
  };

  const renderSuggestion = (suggestion) => (
    <TouchableOpacity
      key={suggestion.place_id}
      onPress={async () => {
        setSelectedAddress(suggestion.description);
        setTempAddress(null);
        setIsAddressSelected(true);
        setSuggestions([]);
      }}
    >
      <Text>{suggestion.description}</Text>
    </TouchableOpacity>
  );

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
        <DataTable.Cell>{`₦${price}`}</DataTable.Cell>
        <DataTable.Cell>{`x ${itemCountInCart(item)}`}</DataTable.Cell>
        <DataTable.Cell>
          {isMainMeal && (
            <Button
              icon={({ size, color }) => (
                <Icon
                  name="delete-forever"
                  size={size}
                  color={colors.ui.error}
                />
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
                <Icon
                  name="delete-forever"
                  size={size}
                  color={colors.ui.error}
                />
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
      {isAddressSelected && <RestaurantInfo restaurant={restaurant} />}
      <ScrollView keyboardShouldPersistTaps={keyboardSetting}>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="large">
            {isAddressSelected && (
              <Text style={{ fontWeight: "bold" }}>Your Order</Text>
            )}
          </Spacer>
          {isAddressSelected && (
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
                    ₦{sum.toFixed(2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
                <DataTable.Cell></DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          )}
        </Spacer>
        <Spacer position="top" size="large" />
        <Divider />
        <Spacer position="top" size="large">
          {name.length > 0 && (
            <>
              <Spacer position="left" size="xl">
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Delivery Address</Text>
                  {selectedAddress && (
                    <Button
                      onPress={() => {
                        setSelectedAddress(null);
                        setTempAddress(null);
                        setIsAddressSelected(false);
                      }}
                      mode="contained"
                      style={{
                        backgroundColor: colors.brand.primary,
                        borderRadius: 70,
                        padding: 4,
                        marginRight: 8,
                      }}
                    >
                      Clear Address
                    </Button>
                  )}
                </View>
              </Spacer>
              <AddressInput
                value={selectedAddress}
                onFocus={() => setIsAddressSelected(false)}
                placeholder="enter delivery address"
                onChangeText={(text) => {
                  setTempAddress(text);
                  setIsAddressSelected(false);
                }}
              />
              {!isAddressSelected && suggestions.map(renderSuggestion)}
            </>
          )}
          <GoToCartButton
            icon={"lead-pencil"}
            disabled={!isAddressSelected || isLoading || deliveryFee === null}
            style={{ width: 200 }}
            onPress={() => {
              setShowModal(true);
            }}
          >
            Add Note for your driver
          </GoToCartButton>
        </Spacer>
        <Spacer position="top" size="xxl" />
        <PayButton
          disabled={!isAddressSelected || isLoading || deliveryFee === null}
          icon={NairaIcon}
          mode="contained"
          onPress={() =>
            navigation.navigate("PayHere", {
              address: selectedAddress,
              restaurant,
              deliveryFee,
            })
          }
        >
          Continue To Payment
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
      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            setShowModal(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                width: "80%",
              }}
            >
              <Text>Instruction for rider:</Text>
              <TextInput
                style={{
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 5,
                  marginTop: 10,
                  padding: 5,
                }}
                onChangeText={(text) => setNote(text)}
                value={note}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                }}
              >
                <GoToCartButton
                  onPress={() => {
                    setShowModal(false);
                    setNote("");
                  }}
                >
                  Cancel
                </GoToCartButton>
                <GoToCartButton
                  onPress={() => {
                    setRidersNote(note);
                    setShowModal(false);
                    setNote("");
                  }}
                >
                  Save
                </GoToCartButton>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </TabLink>
  );
};
