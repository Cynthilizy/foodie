import React, { useState, useContext } from "react";
import { ScrollView, View, Image, TouchableOpacity } from "react-native";
import { List, Divider } from "react-native-paper";
import { TabLink } from "../stylings/restaurant-info.styles";
import { Text } from "../styles/text.styles";
import { RestaurantInfo } from "../features/restaurant-info";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { foodPhotos } from "../foodPhotos";
import { CartContext } from "../context/cart.context";
import { colors } from "../styles/colors.styles";

export const NairaIcon = () => {
  return <Icon name="currency-ngn" color="white" size={18} />;
};

export const RestaurantDetailScreen = ({ navigation, route }) => {
  const [riceExpanded, setriceExpanded] = useState(false);
  const [swallowExpanded, setswallowExpanded] = useState(false);
  const [specialExpanded, setSpecialExpanded] = useState(false);

  const { restaurant } = route.params;
  const { addToCart, cart, setSelectedTitle } = useContext(CartContext);

  const isMealInCart = (title) => {
    return cart.some((item) => item.item === title);
  };

  const CustomListItem = ({
    title,
    imageSource,
    price,
    description,
    isRice,
    isSwallow,
    isSpecial,
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (isRice && !isMealInCart(title)) {
            addToCart({ item: title, price: price }, restaurant);
            setSelectedTitle((prevSelectedTitles) => [
              ...prevSelectedTitles,
              title,
            ]);
            navigation.navigate("RiceOption", {
              title,
              price,
              imageSource,
              description,
              restaurant,
            });
          } else if (isRice && isMealInCart(title)) {
            navigation.navigate("RiceOption", {
              title,
              price,
              imageSource,
              description,
              restaurant,
            });
          } else if (isSwallow && !isMealInCart(title)) {
            addToCart({ item: title, price: price }, restaurant);
            setSelectedTitle((prevSelectedTitles) => [
              ...prevSelectedTitles,
              title,
            ]);
            navigation.navigate("SwallowOption", {
              title,
              price,
              imageSource,
              description,
              restaurant,
            });
          } else if (isSwallow && isMealInCart(title)) {
            navigation.navigate("SwallowOption", {
              title,
              price,
              imageSource,
              description,
              restaurant,
            });
          } else if (isSpecial) {
            addToCart({ item: title, price: price }, restaurant);
            setSelectedTitle((prevSelectedTitles) => [
              ...prevSelectedTitles,
              title,
            ]);
          }
        }}
      >
        <List.Item
          title={title}
          description={
            <Text variant="caption" style={{ color: colors.text.success }}>
              {description}
            </Text>
          }
          descriptionNumberOfLines={null}
          right={() => (
            <Image source={imageSource} style={{ width: 100, height: 100 }} />
          )}
        />
      </TouchableOpacity>
    );
  };

  return (
    <TabLink>
      <RestaurantInfo restaurant={restaurant} />
      <ScrollView>
        <List.Accordion
          title="Rice Meals"
          left={(props) => <List.Icon {...props} />}
          expanded={riceExpanded}
          onPress={() => setriceExpanded(!riceExpanded)}
        >
          <CustomListItem
            title="Jollof Rice"
            imageSource={foodPhotos.jollofRice}
            price={25000}
            isRice={true}
          />
          <Divider />
          <CustomListItem
            title="Fried Rice"
            imageSource={foodPhotos.friedRice}
            price={25000}
            isRice={true}
          />
          <Divider />
          <CustomListItem
            title="Steamed Rice"
            imageSource={foodPhotos.steamedRice}
            price={20000}
            isRice={true}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Swallow"
          left={(props) => <List.Icon {...props} />}
          expanded={swallowExpanded}
          onPress={() => setswallowExpanded(!swallowExpanded)}
        >
          <CustomListItem
            title="Egusi Soup"
            imageSource={foodPhotos.egusi}
            price={80000}
            isSwallow={true}
          />
          <Divider />
          <CustomListItem
            title="Efo RiRo"
            imageSource={foodPhotos.efoRiro}
            price={80000}
            isSwallow={true}
          />
          <Divider />
          <CustomListItem
            title="Afang Soup"
            imageSource={foodPhotos.afang}
            price={80000}
            isSwallow={true}
          />
          <Divider />
          <CustomListItem
            title="Oha Soup"
            imageSource={foodPhotos.oha}
            price={80000}
            isSwallow={true}
          />
          <Divider />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Special Plates"
          left={(props) => <List.Icon {...props} />}
          expanded={specialExpanded}
          onPress={() => setSpecialExpanded(!specialExpanded)}
        >
          <CustomListItem
            title="Jollof Rice Special"
            imageSource={foodPhotos.specialPlate}
            price={170000}
            description="jollof rice, plantain, chicken, coleslaw, coke"
            isSpecial={true}
          />
          <Divider />
          <CustomListItem
            title="Steamed Rice Special"
            imageSource={foodPhotos.specialPlate}
            price={170000}
            description="steamed rice, plantain, turkey, coleslaw, coke"
            isSpecial={true}
          />
          <Divider />
          <CustomListItem
            title="Pounded Yam Special"
            imageSource={foodPhotos.specialPlate}
            price={150000}
            description="pounded-yam, melon-soup(egusi), cow-skin(pkomo), beef,
              mackrel-fish(Titus)"
            isSpecial={true}
          />
          <Divider />
          <CustomListItem
            title="Eba Special"
            imageSource={foodPhotos.specialPlate}
            price={150000}
            description="eba, vegetable-soup, assorted-meat, mackrel-fish(Titus),
              cow-skin(Pkomo)"
            isSpecial={true}
          />
          <Divider />
        </List.Accordion>
      </ScrollView>
    </TabLink>
  );
};
