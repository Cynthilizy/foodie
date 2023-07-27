import styled from "styled-components/native";
import { FlatList } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "../styles/colors.styles";

export const RestaurantList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

export const OrderButton = styled(Button).attrs({
  color: colors.brand.primary,
})`
  padding: ${(props) => props.theme.space[2]};
  width: 100%;
  align-self: center;
`;
