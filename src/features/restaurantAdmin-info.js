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
import { View } from "react-native";

export const RestaurantAdminInfo = ({ restaurant = {} }) => {
  const {
    name = "test restaurant",
    photo = "https://ravintolamandala.fi/wp-content/uploads/2014/05/indian-feast-2-copy-2048x1588.jpg",
    rating = 4,
    address = "test address",
    placeId,
    openingHours = "9",
    closingHours = "19",
  } = restaurant;
  const ratingArray = Array.from(new Array(Math.floor(rating)));

  const renderImage = () => {
    if (typeof photo === "string") {
      return (
        <CardCover
          key={name}
          source={{ uri: photo }}
          onError={(error) => console.log("Error loading photo:", error)}
        />
      );
    } else if (photo && photo.uri) {
      return (
        <CardCover
          key={name}
          source={photo}
          onError={() => console.log("Error loading photo")}
        />
      );
    } else {
      return null; // Render nothing if photo prop is not valid
    }
  };

  return (
    <RestaurantCard elevation={2}>
      <View>{renderImage()}</View>
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
              <Text>{`opens: ${openingHours}`}</Text>
              <Text>{`closes: ${closingHours}`}</Text>
            </Spacer>
          </SectionEnd>
        </Section>
        <Address>{address}</Address>
      </Info>
    </RestaurantCard>
  );
};
