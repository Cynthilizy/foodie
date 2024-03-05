import React, { useContext } from "react";
import { Text } from "../styles/text.styles";
import {
  CardCover,
  Info,
  RestaurantCard,
  Section,
  SectionEnd,
} from "../stylings/restaurant-info.styles";
import { Spacer } from "../styles/spacer.styles";
import { View } from "react-native";
import foodieImage from "../../assets/foodie.png";

export const MealInfoAdmin = ({ meal }) => {
  const { name = "title of meal", photo = foodieImage } = meal;

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
            <Spacer position="right" size="large"></Spacer>
          </SectionEnd>
        </Section>
      </Info>
    </RestaurantCard>
  );
};
