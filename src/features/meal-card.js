import React, { useContext } from "react";
import { Text } from "../styles/text.styles";
import {
  CardCover,
  Info,
  RestaurantCard,
  Section,
  SectionEnd,
} from "../stylings/restaurant-info.styles";
import { CartContext } from "../context/cart.context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Spacer } from "../styles/spacer.styles";
import { colors } from "../styles/colors.styles";
import { View } from "react-native";
import foodieImage from "../../assets/foodie.png";

export const MealInfo = ({ meal, navigation }) => {
  const { name = "title of meal", photo = foodieImage } = meal;
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.length;

  return (
    <RestaurantCard elevation={2}>
      <View>
        <CardCover
          key={name}
          source={typeof photo === "string" ? { uri: photo } : photo}
        />
      </View>
      <Info>
        <Section>
          <Text variant="label">{name}</Text>
          <SectionEnd>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="cart"
                color={colors.brand.primary}
                size={24}
                onPress={() => {
                  navigation.navigate("Checkout", {
                    screen: "CheckOut",
                  });
                }}
              />
              <Text>{cartItemCount}</Text>
            </View>
            <Spacer position="right" size="large"></Spacer>
          </SectionEnd>
        </Section>
      </Info>
    </RestaurantCard>
  );
};
