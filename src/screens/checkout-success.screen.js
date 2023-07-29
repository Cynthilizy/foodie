import React from "react";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import { CartIcon, CartIconContainer } from "../stylings/checkout.styles";

export const CheckoutSuccessScreen = () => (
  <TabLink>
    <CartIconContainer>
      <CartIcon icon="check-bold" />
      <Text variant="label">Success!</Text>
    </CartIconContainer>
  </TabLink>
);
