import { styled } from "styled-components/native";
import { View, SafeAreaView, Platform, StatusBar, Image } from "react-native";
import { Card } from "react-native-paper";

const isAndroid = Platform.OS === "android";

export const RestaurantCard = styled(Card)`
  background-color: ${(props) => props.theme.colors.bg.primary};
  width: 95%;
  align-self: center;
`;

export const Info = styled(View)`
  padding: ${(props) => props.theme.space[2]};
`;

export const Address = styled.Text`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: ${(props) => props.theme.fontSizes.caption};
`;

export const Rating = styled(View)`
  flex-direction: row;
  padding-top: ${(props) => props.theme.space[2]};
  padding-bottom: ${(props) => props.theme.space[2]};
`;

export const CardCover = styled(Card.Cover)`
  padding: ${(props) => props.theme.space[2]};
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

export const Section = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const SectionEnd = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
`;

export const TabLink = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${isAndroid ? StatusBar.currentHeight : 0}px;
`;

export const Icon = styled(Image)`
  width: 30px;
  height: 30px;
`;
