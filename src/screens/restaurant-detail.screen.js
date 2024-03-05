import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/cart.context";
import {
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { List, Text as PaperText, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../styles/colors.styles";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { RestaurantInfo } from "../features/restaurant-info";
import { TabLink } from "../stylings/restaurant-info.styles";
import foodieImage from "../../assets/foodie.png";

export const NairaIcon = () => {
  return <Icon name="currency-ngn" color="white" size={18} />;
};

export const RestaurantDetailScreen = ({ navigation, route }) => {
  const { restaurant } = route.params;
  const { fetchMenuByRestaurantId } = useContext(AuthenticationContextAdmin);
  const [menus, setMenus] = useState([]);
  const [categoryStates, setCategoryStates] = useState({});
  const [menuType, setMenuType] = useState([]);

  const { addToCart, cart, setSelectedTitle } = useContext(CartContext);

  const isMealInCart = (title) => {
    return cart.some((item) => item.item === title);
  };

  const fetchMenus = async () => {
    const restaurantData = await fetchMenuByRestaurantId(restaurant.id);
    if (restaurantData) {
      const mainMenuData = restaurantData.mainMenu;
      const menuArray = [];
      const categoryKeys = Object.keys(mainMenuData).sort();
      for (const categoryKey of categoryKeys) {
        const category = mainMenuData[categoryKey];
        const categoryMenu = [];
        const itemKeys = Object.keys(category).sort();
        for (const itemKey of itemKeys) {
          if (itemKey === "mealType") {
            setMenuType(category[itemKey]);
            continue;
          }
          const menuItem = category[itemKey];
          categoryMenu.push({
            title: itemKey,
            imageSource: menuItem[0],
            price: menuItem[1],
          });
        }
        menuArray.push({
          category: categoryKey,
          items: categoryMenu,
          expanded: false,
          menuType: category.mealType,
        });
      }
      setMenus(menuArray);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [restaurant.id, fetchMenuByRestaurantId, restaurant]);

  return (
    <TabLink>
      <RestaurantInfo restaurant={restaurant} />
      <ScrollView style={styles.container}>
        <List.Section>
          {menus.map((menu, categoryIndex) => (
            <>
              <List.Accordion
                key={categoryIndex}
                title={menu.category}
                left={(props) => <List.Icon {...props} icon="pot-steam" />}
              >
                {menu.items.length > 0
                  ? menu.items.map((item, itemIndex) => (
                      <>
                        <TouchableOpacity
                          key={item.name}
                          style={styles.menuItem}
                          onPress={() => {
                            console.log(
                              "menu type",
                              menus[categoryIndex].menuType
                            );
                            if (!isMealInCart(item.title)) {
                              addToCart(
                                { item: item.title, price: item.price },
                                restaurant
                              );
                              setSelectedTitle((prevSelectedTitles) => [
                                ...prevSelectedTitles,
                                item.title,
                              ]);
                              navigation.navigate("SelectedMeal", {
                                name: item.title,
                                imageSource: item.imageSource,
                                restaurant: restaurant,
                                price: item.price,
                                menuType: menus[categoryIndex].menuType,
                              });
                            } else {
                              navigation.navigate("SelectedMeal", {
                                name: item.title,
                                imageSource: item.imageSource,
                                restaurant: restaurant,
                                price: item.price,
                                menuType: menus[categoryIndex].menuType,
                              });
                            }
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <PaperText variant="headlineSmall">
                              {item.title}
                            </PaperText>
                            <PaperText
                              variant="titleMedium"
                              style={{ color: colors.text.success }}
                            >
                              Price: {`₦${item.price}`}
                            </PaperText>
                          </View>

                          <Image
                            source={
                              typeof item.imageSource === "string"
                                ? { uri: item.imageSource }
                                : item.imageSource
                            }
                            style={styles.itemImage}
                          />
                        </TouchableOpacity>
                        <Divider />
                      </>
                    ))
                  : null}
              </List.Accordion>
              <Divider />
            </>
          ))}
        </List.Section>
      </ScrollView>
    </TabLink>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f1f1f1",
    marginBottom: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
