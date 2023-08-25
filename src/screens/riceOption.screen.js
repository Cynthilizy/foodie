import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, Image } from "react-native";
import { Checkbox, Divider, List } from "react-native-paper";
import { TabLink } from "../stylings/restaurant-info.styles";
import { foodPhotos } from "../foodPhotos";
import { colors } from "../styles/colors.styles";
import { AddToCartButton } from "../stylings/restaurant-list.styles";
import { Spacer } from "../styles/spacer.styles";
import { Text } from "../styles/text.styles";
import { MealInfo } from "../features/meal-card";
import { CartContext } from "../context/cart.context";
import { styled } from "styled-components/native";
import { GoToCartButton } from "../stylings/restaurant-list.styles";

const InfoView = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const AddView = styled(View)`
  flex-direction: row;
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const RiceOptionsScreen = ({ route, navigation }) => {
  const [proteinExpanded, setproteinExpanded] = useState(false);
  const [sideExpanded, setSideExpanded] = useState(false);
  const [drinksExpanded, setDrinksExpanded] = useState(false);

  const { title, price, imageSource, restaurant, description } = route.params;
  const { removeFromCart, addToCart, cart, removeOneTitle, selectedTitle } =
    useContext(CartContext);
  const [additionalQuantity, setAdditionalQuantity] = useState(false);

  useEffect(() => {
    if (!selectedTitle.includes(route.params.title)) {
      navigation.pop();
    }
  }, [selectedTitle, route.params.title]);

  const formatPrice = (price) => {
    return (price / 100).toFixed(0);
  };

  const itemCountInCart = (itemTitle) => {
    return cart.filter((item) => item.item === itemTitle).length;
  };

  useEffect(() => {
    const isExtraTitleInCart = cart.some(
      (item) => item.item === `extra ${title}`
    );
    setAdditionalQuantity(isExtraTitleInCart);
  }, [cart, title]);

  const CustomListItem = ({ title, price, imageSource, description }) => {
    const itemCartCount = itemCountInCart(title);
    return (
      <List.Item
        title={() => (
          <View>
            <AddView>
              <Text variant="label">{`${title} - ₦${formatPrice(price)}`}</Text>
              <Spacer position="left" size="large"></Spacer>
              <Text>
                {itemCartCount > 0 && <Text>{`x ${itemCartCount}`}</Text>}
              </Text>
            </AddView>
            <Spacer position="top" size="small" />
            <AddToCartButton
              icon={"minus"}
              onPress={() => {
                if (itemCartCount > 0) {
                  removeOneTitle(`${title}`);
                }
              }}
            ></AddToCartButton>
            <AddToCartButton
              icon={"plus"}
              onPress={() => {
                addToCart({ item: title, price: price }, restaurant);
              }}
            ></AddToCartButton>
          </View>
        )}
        removeOneItem={removeOneTitle}
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
    );
  };

  return (
    <TabLink>
      <MealInfo
        meal={{
          name: title,
          photo: imageSource,
        }}
        navigation={navigation}
      />
      <Spacer position="bottom" size="medium" />
      <Spacer position="left" size="large">
        <InfoView>
          <Text variant="body">{`${title} - ₦${formatPrice(price)}`}</Text>
          <Checkbox status="checked" onPress={null} />
        </InfoView>
        <InfoView>
          <Text variant="body">
            {`Add extra ${title} to my order - ₦${formatPrice(price)}`}
          </Text>
          <Checkbox
            status={additionalQuantity ? "checked" : "unchecked"}
            onPress={() => {
              setAdditionalQuantity(!additionalQuantity);
              if (additionalQuantity) {
                removeFromCart(`extra ${title}`);
              } else {
                addToCart({ item: `extra ${title}`, price: price }, restaurant);
              }
            }}
          />
        </InfoView>
      </Spacer>
      <ScrollView>
        <List.Accordion
          title="Add Protein"
          left={(props) => <List.Icon {...props} />}
          expanded={proteinExpanded}
          onPress={() => setproteinExpanded(!proteinExpanded)}
        >
          <CustomListItem
            title="Chicken"
            imageSource={foodPhotos.chicken}
            price={70000}
          />
          <Divider />
          <CustomListItem
            title="Mackrel Fish (Titus)"
            imageSource={foodPhotos.mackrel}
            price={50000}
          />
          <Divider />
          <CustomListItem
            title="Tilapia Fish"
            imageSource={foodPhotos.tilapia}
            price={70000}
          />
          <Divider />
          <CustomListItem
            title="Turkey"
            imageSource={foodPhotos.turkey}
            price={70000}
          />
          <Divider />
          <CustomListItem
            title="Assorted Meat"
            imageSource={foodPhotos.assorted}
            price={100000}
          />
          <Divider />
          <CustomListItem
            title="Cow Skin (Pkomo)"
            imageSource={foodPhotos.pkomo}
            price={20000}
          />
          <Divider />
          <CustomListItem
            title="Beef"
            imageSource={foodPhotos.beef}
            price={20000}
          />
          <Divider />
          <CustomListItem
            title="Peppered Snail"
            imageSource={foodPhotos.snail}
            price={50000}
          />
          <Divider />
          <CustomListItem
            title="Boiled Eggs"
            imageSource={foodPhotos.boiledEggs}
            price={15000}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Add Sides"
          left={(props) => <List.Icon {...props} />}
          expanded={sideExpanded}
          onPress={() => setSideExpanded(!sideExpanded)}
        >
          <CustomListItem
            title="Plantain"
            imageSource={foodPhotos.plantain}
            price={30000}
          />
          <Divider />
          <CustomListItem
            title="Moi-Moi"
            imageSource={foodPhotos.moimoi}
            price={30000}
          />
          <Divider />
          <CustomListItem
            title="Salad (Coleslaw)"
            imageSource={foodPhotos.salad}
            price={30000}
          />
          <Divider />
          <CustomListItem
            title="Spaghetti"
            imageSource={foodPhotos.spaghetti}
            price={20000}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Add Drinks"
          left={(props) => <List.Icon {...props} />}
          expanded={drinksExpanded}
          onPress={() => setDrinksExpanded(!drinksExpanded)}
        >
          <CustomListItem
            title="Water"
            imageSource={foodPhotos.water}
            price={20000}
          />
          <Divider />
          <CustomListItem
            title="Coke"
            imageSource={foodPhotos.softDrinks}
            price={25000}
          />
          <Divider />
          <CustomListItem
            title="Fanta"
            imageSource={foodPhotos.softDrinks}
            price={25000}
          />
          <Divider />
          <CustomListItem
            title="Sprite"
            imageSource={foodPhotos.softDrinks}
            price={25000}
          />
          <Divider />
          <CustomListItem
            title="Orange Juice"
            imageSource={foodPhotos.orangeJuice}
            price={50000}
          />
          <Divider />
          <CustomListItem
            title="Ice Tea"
            imageSource={foodPhotos.iceTea}
            price={50000}
          />
        </List.Accordion>
      </ScrollView>
      <Spacer position="bottom" size="large">
        <GoToCartButton
          icon={"cart"}
          mode="contained"
          onPress={() => {
            navigation.navigate("Checkout", {
              screen: "CheckOut",
              //params: { title },
            });
          }}
        >
          Go To Cart
        </GoToCartButton>
      </Spacer>
    </TabLink>
  );
};
