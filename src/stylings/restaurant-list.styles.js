import styled from "styled-components/native";
import { FlatList } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../styles/colors.styles";

export const RestaurantList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

export const AddToCartButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  width: 10%;
`;

export const GoToCartButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[0]};
  width: 35%;
  align-self: center;
`;
