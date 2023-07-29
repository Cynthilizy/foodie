import React, { useContext, useState } from "react";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import {
  CartIcon,
  CartIconContainer,
  NameInput,
  PayButton,
  ClearButton,
  PaymentProcessing,
} from "../stylings/checkout.styles";
import { NairaIcon } from "./restaurant-detail.screen";
import { CreditCardInput } from "../features/credit-card.component";
import { CartContext } from "../context/cart.context";
import { Spacer } from "../styles/spacer.styles";
import { ScrollView } from "react-native";
import { List, Divider } from "react-native-paper";
import { RestaurantInfo } from "../features/restaurant-info";
import { payRequest } from "../service/checkout.service";

export const CheckoutScreen = ({ navigation }) => {
  const { cart, restaurant, clearCart, sum } = useContext(CartContext);
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
  return (
    <TabLink>
      <RestaurantInfo restaurant={restaurant} />
      {isLoading && <PaymentProcessing />}
      <ScrollView>
        <Spacer position="left" size="medium">
          <Spacer position="top" size="large">
            <Text>Your Order</Text>
          </Spacer>
          <List.Section>
            {cart.map(({ item, price }, index) => {
              const timestamp = Date.now();
              const key = `${timestamp}-${index}`;
              return <List.Item title={`${item} - ${price / 100}`} key={key} />;
            })}
          </List.Section>
          <Text>Total: {sum / 100}</Text>
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
          icon={EuroIcon}
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
