import React from "react";
import { SvgXml } from "react-native-svg";
import starIcon from "../../assets/starIcon";
import isOpen from "../../assets/isOpen";
import isClosed from "../../assets/isClosed";
import { Text } from "../styles/text.styles";
import {
  Section,
  SectionEnd,
  Rating,
  CardCover,
  Info,
  Icon,
  Address,
  RestaurantCard,
} from "../stylings/restaurant-info.styles";
import { Spacer } from "../styles/spacer.styles";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { Favourite } from "./favourites.component";
import { View } from "react-native";

const isRestaurantOpenNow = () => {
  const currentTime = new Date(); // Get the current time in client's timezone
  const nigerianTimezone = "Africa/Lagos";

  // Convert the current time to Nigerian time zone
  const nigerianTime = utcToZonedTime(currentTime, nigerianTimezone);

  const startHour = 9; // 9am
  const endHour = 19; // 7pm
  const currentHour = nigerianTime.getHours();

  return currentHour >= startHour && currentHour < endHour;
};

export const RestaurantInfo = ({ restaurant = {} }) => {
  const {
    name = "test restaurant",
    icon = "https://www.vhv.rs/dpng/d/429-4294391_restaurant-menu-icon-png-icons-for-food-app.png",
    photos = [
      "https://ravintolamandala.fi/wp-content/uploads/2014/05/indian-feast-2-copy-2048x1588.jpg",
    ],
    rating = 4,
    address = "test address",
    placeId,
  } = restaurant;
  const ratingArray = Array.from(new Array(Math.floor(rating)));
  return (
    <RestaurantCard elevation={2}>
      <View>
        <Favourite restaurant={restaurant} />
        <CardCover key={name} source={{ uri: photos[0] }} />
      </View>
      <Info>
        <Text variant="label">{name}</Text>
        <Section>
          <Rating>
            {ratingArray.map((_, index) => (
              <SvgXml
                key={`star-${placeId}-${index}`}
                xml={starIcon}
                width={20}
                height={20}
              />
            ))}
          </Rating>
          <SectionEnd>
            <Spacer position="right" size="large">
              {isRestaurantOpenNow() ? (
                <SvgXml xml={isOpen} width={50} height={50} />
              ) : (
                <SvgXml xml={isClosed} width={50} height={50} />
              )}
            </Spacer>
            <Spacer position="left" size="large">
              <Icon source={{ uri: icon }} />
            </Spacer>
          </SectionEnd>
        </Section>
        <Address>{address}</Address>
      </Info>
    </RestaurantCard>
  );
};
