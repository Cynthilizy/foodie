import React from "react";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import { colors } from "../styles/colors.styles";
import { CartIcon, CartIconContainer } from "../stylings/checkout.styles";

export const CheckoutErrorScreen = ({ route }) => {
  const { error = "" } = route.params;
  return (
    <TabLink>
      <CartIconContainer>
        <CartIcon icon="close" bg={colors.ui.error} />
        <Text variant="label">{error}</Text>
      </CartIconContainer>
    </TabLink>
  );
};
