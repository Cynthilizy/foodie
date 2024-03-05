import React, { useState, useContext, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { List, Divider, Checkbox } from "react-native-paper";
import { TabLink } from "../stylings/restaurant-info.styles";
import { colors } from "../styles/colors.styles";
import { Spacer } from "../styles/spacer.styles";
import { Text } from "../styles/text.styles";
import { MealInfo } from "../features/meal-card";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import foodieImage from "../../assets/foodie.png";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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

export const SelectedMealScreen = ({ route, navigation }) => {
  const { name, imageSource, price, restaurant, menuType } = route.params;
  const { fetchMenuByRestaurantId } = useContext(AuthenticationContextAdmin);
  const [proteinList, setProteinList] = useState([]);
  const [swallowList, setSwallowList] = useState([]);
  const [sidesList, setSidesList] = useState([]);
  const [drinksList, setDrinksList] = useState([]);
  const [mealType, setMealType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState(null);

  const {
    removeFromCart,
    addToCart,
    cart,
    removeOneTitle,
    selectedTitle,
    removeAllItemsByTitle,
    restaurantNote,
    setRestaurantNote,
  } = useContext(CartContext);
  const [additionalQuantity, setAdditionalQuantity] = useState(false);

  useEffect(() => {
    if (!selectedTitle.includes(route.params.name)) {
      navigation.pop();
    }
  }, [selectedTitle, route.params.name]);

  const formatPrice = (price) => {
    return (price / 100).toFixed(0);
  };

  useEffect(() => {
    fetchMenus();
  }, [restaurant]);

  const fetchMenus = async () => {
    const restaurantData = await fetchMenuByRestaurantId(restaurant.id);
    if (restaurantData) {
      const { proteinMenu, swallowMenu, sidesMenu, drinksMenu } =
        restaurantData;

      setProteinList(mapCategoryToList(proteinMenu));
      setSwallowList(mapCategoryToList(swallowMenu));
      setSidesList(mapCategoryToList(sidesMenu));
      setDrinksList(mapCategoryToList(drinksMenu));
    }
  };

  const mapCategoryToList = (category) => {
    if (category) {
      return Object.keys(category).map((itemName) => ({
        name: itemName,
        image: category[itemName][0] || null,
        price: category[itemName][1],
      }));
    } else {
      return [];
    }
  };

  const itemCountInCart = (itemTitle) => {
    return cart.filter((item) => item.item === itemTitle).length;
  };

  useEffect(() => {
    const isExtraTitleInCart = cart.some(
      (item) => item.item === `extra ${name}`
    );
    setAdditionalQuantity(isExtraTitleInCart);
  }, [cart, name]);

  const ListItem = ({
    item,
    addToCart,
    removeOneTitle,
    restaurant,
    removeAllItemsByTitle,
  }) => {
    const itemCartCount = itemCountInCart(item.name);

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <AddView>
            <Text variant="label">{`${item.name}   ₦${item.price}`}</Text>
            <Spacer position="left" size="large"></Spacer>
            <Text>
              {itemCartCount > 0 && <Text>{`x ${itemCartCount}`}</Text>}
            </Text>
            <Spacer position="left" size="large"></Spacer>
            {itemCartCount > 0 && (
              <Icon
                name="delete-forever"
                color="red"
                size={18}
                onPress={() => removeAllItemsByTitle(item.name)}
              />
            )}
          </AddView>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.ui.secondary,
                borderRadius: 50,
                width: 25,
                height: 25,
              }}
              onPress={() => {
                if (itemCartCount > 0) {
                  removeOneTitle(item.name);
                }
              }}
            >
              <Text
                variant="label"
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 30,
                  marginTop: -6,
                }}
              >
                -
              </Text>
            </TouchableOpacity>
            <Spacer position="right" size="xl"></Spacer>
            <TouchableOpacity
              style={{
                backgroundColor: colors.ui.secondary,
                borderRadius: 50,
                width: 25,
                height: 25,
              }}
              onPress={() => {
                addToCart({ item: item.name, price: item.price }, restaurant);
              }}
            >
              <Text
                variant="label"
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 25,
                  marginTop: -4,
                }}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {item.image ? (
          typeof item.image === "number" ? (
            <Image
              source={item.image}
              style={{ width: 70, height: 70, borderRadius: 35 }}
            />
          ) : (
            <Image
              source={{ uri: item.image }}
              style={{ width: 70, height: 70, borderRadius: 35 }}
            />
          )
        ) : (
          <Image
            source={foodieImage}
            style={{ width: 70, height: 70, borderRadius: 35 }}
          />
        )}
      </View>
    );
  };

  return (
    <TabLink>
      <MealInfo
        meal={{
          name: name,
          photo: imageSource,
          price: price,
        }}
        navigation={navigation}
      />
      <Spacer position="bottom" size="medium" />
      <Spacer position="left" size="large">
        <InfoView>
          <Text variant="label">{`${name} - ₦${price}`}</Text>
          <Checkbox status="checked" onPress={null} />
        </InfoView>
        <InfoView>
          <Text variant="label">{`extra ${name}  - ₦${price}`}</Text>
          <Checkbox
            status={additionalQuantity ? "checked" : "unchecked"}
            onPress={() => {
              setAdditionalQuantity(!additionalQuantity);
              if (additionalQuantity) {
                removeFromCart(`extra ${name}`);
              } else {
                addToCart({ item: `extra ${name}`, price: price }, restaurant);
              }
            }}
          />
        </InfoView>
      </Spacer>
      <ScrollView>
        <List.Accordion
          title="Select Your Protein"
          expanded={mealType === "Protein"}
          onPress={() => setMealType(mealType === "Protein" ? "" : "Protein")}
          titleStyle={{
            fontSize: 18,
            fontWeight: "bold",
            color: colors.brand.primary,
            letterSpacing: 1,
            textShadowColor: "rgba(0, 0, 0, 0.2)",
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
          }}
          left={(props) => (
            <Icon
              {...props}
              name="fish"
              size={24}
              color={colors.brand.primary}
            />
          )}
        >
          {proteinList.map((item, index) => (
            <React.Fragment key={item.name}>
              <ListItem
                item={item}
                addToCart={addToCart}
                removeOneTitle={removeOneTitle}
                restaurant={restaurant}
                removeAllItemsByTitle={removeAllItemsByTitle}
              />
              <Divider />
            </React.Fragment>
          ))}
        </List.Accordion>
        <Divider />
        {menuType !== "Rice Meal" && menuType !== "Others" && (
          <List.Accordion
            title="Select Your Swallow"
            expanded={mealType === "Swallow"}
            onPress={() => setMealType(mealType === "Swallow" ? "" : "Swallow")}
            titleStyle={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.brand.primary,
              letterSpacing: 1,
              textShadowColor: "rgba(0, 0, 0, 0.2)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            }}
            left={(props) => (
              <Icon
                {...props}
                name="food-takeout-box"
                size={24}
                color={colors.brand.primary}
              />
            )}
          >
            {swallowList.map((item, index) => (
              <React.Fragment key={item.name}>
                <ListItem
                  item={item}
                  addToCart={addToCart}
                  removeOneTitle={removeOneTitle}
                  restaurant={restaurant}
                  removeAllItemsByTitle={removeAllItemsByTitle}
                />
                <Divider />
              </React.Fragment>
            ))}
          </List.Accordion>
        )}
        <Divider />
        {menuType !== "Swallow Meal" && menuType !== "Others" && (
          <List.Accordion
            title="Select Sides"
            expanded={mealType === "Sides"}
            onPress={() => setMealType(mealType === "Sides" ? "" : "Sides")}
            titleStyle={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.brand.primary,
              letterSpacing: 1,
              textShadowColor: "rgba(0, 0, 0, 0.2)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            }}
            left={(props) => (
              <Icon
                {...props}
                name="food-variant"
                size={24}
                color={colors.brand.primary}
              />
            )}
          >
            {sidesList.map((item, index) => (
              <React.Fragment key={item.name}>
                <ListItem
                  item={item}
                  addToCart={addToCart}
                  removeOneTitle={removeOneTitle}
                  restaurant={restaurant}
                  removeAllItemsByTitle={removeAllItemsByTitle}
                />
                <Divider />
              </React.Fragment>
            ))}
          </List.Accordion>
        )}
        <Divider />
        <List.Accordion
          title="Select Drinks"
          expanded={mealType === "Drinks"}
          onPress={() => setMealType(mealType === "Drinks" ? "" : "Drinks")}
          titleStyle={{
            fontSize: 18,
            fontWeight: "bold",
            color: colors.brand.primary,
            letterSpacing: 1,
            textShadowColor: "rgba(0, 0, 0, 0.2)",
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
          }}
          left={(props) => (
            <Icon
              {...props}
              name="bottle-soda"
              size={24}
              color={colors.brand.primary}
            />
          )}
        >
          {drinksList.map((item, index) => (
            <React.Fragment key={item.name}>
              <ListItem
                item={item}
                addToCart={addToCart}
                removeOneTitle={removeOneTitle}
                restaurant={restaurant}
                removeAllItemsByTitle={removeAllItemsByTitle}
              />
              <Divider />
            </React.Fragment>
          ))}
        </List.Accordion>
      </ScrollView>
      <Spacer position="bottom" size="large">
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <GoToCartButton
            icon={"lead-pencil"}
            mode="contained"
            onPress={() => {
              setShowModal(true);
            }}
          >
            Add Note
          </GoToCartButton>
          <GoToCartButton
            icon={"cart"}
            mode="contained"
            onPress={() => {
              navigation.navigate("Checkout", {
                screen: "CheckOut",
              });
            }}
          >
            Go To Cart
          </GoToCartButton>
        </View>
      </Spacer>
      {showModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            setShowModal(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
                width: "80%",
              }}
            >
              <Text>Instruction for restaurant:</Text>
              <TextInput
                style={{
                  borderColor: "gray",
                  borderWidth: 1,
                  borderRadius: 5,
                  marginTop: 10,
                  padding: 5,
                }}
                onChangeText={(text) => setNote(text)}
                value={note}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                }}
              >
                <GoToCartButton
                  onPress={() => {
                    setShowModal(false);
                    setNote("");
                  }}
                >
                  Cancel
                </GoToCartButton>
                <GoToCartButton
                  onPress={() => {
                    setRestaurantNote(note);
                    setShowModal(false);
                    setNote("");
                  }}
                >
                  Save
                </GoToCartButton>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </TabLink>
  );
};
