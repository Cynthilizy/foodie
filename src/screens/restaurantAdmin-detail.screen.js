import React, { useState, useEffect, useContext, useRef } from "react";
import {
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  View,
  ActivityIndicator,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  List,
  IconButton,
  Text as PaperText,
  Divider,
} from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { colors } from "../styles/colors.styles";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { Text } from "../styles/text.styles";
import { RestaurantAdminInfo } from "../features/restaurantAdmin-info";
import { TabLink } from "../stylings/restaurant-info.styles";
import { createNewMenu } from "../service/firestore.service";
import { addItemToMenu } from "../service/firestore.service";
import { deleteMenuCategory } from "../service/firestore.service";
import { deleteItemFromMenu } from "../service/firestore.service";
import foodieImage from "../../assets/foodie.png";
import { deleteRestaurant } from "../service/firestore.service";
import { Spacer } from "../styles/spacer.styles";

export const NairaIcon = () => {
  return <Icon name="currency-ngn" color="white" size={18} />;
};

export const RestaurantAdminDetailScreen = ({ navigation, route }) => {
  const { restaurant } = route.params;
  const { fetchMenuByRestaurantId } = useContext(AuthenticationContextAdmin);
  const [newMenu, setNewMenu] = useState("");
  const [menus, setMenus] = useState([]);
  const [selectedImage, setSelectedImage] = useState(foodieImage);
  const [loadingImage, setLoadingImage] = useState(false);
  const [creatingMenu, setCreatingMenu] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [newItemStates, setNewItemStates] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [categoryStates, setCategoryStates] = useState({});
  const [menuType, setMenuType] = useState([]);

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
        setNewItemStates((prevState) => [
          ...prevState,
          {
            name: "",
            imageSource: foodieImage,
            price: "",
          },
        ]);
      }
      setMenus(menuArray);
      const initialItemState = {
        name: "",
        imageSource: foodieImage,
        price: "",
      };
      const initialItemStates = Array(menuArray.length).fill(initialItemState);
      setNewItemStates(initialItemStates);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [restaurant.id, fetchMenuByRestaurantId, restaurant]);

  useEffect(() => {
    if (selectedImage) {
      console.log("selected image", selectedImage);
    }
  }, [selectedImage]);

  const handleDeleteCategory = async (categoryIndex, categoryName) => {
    Alert.alert(
      "Delete Menu",
      `Are you sure you want to delete ${categoryName}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const deleted = await deleteMenuCategory(
              restaurant.id,
              categoryName
            );
            if (deleted) {
              Alert.alert("Menu deleted successfully");
              const updatedMenus = [...menus];
              updatedMenus.splice(categoryIndex, 1);
              setMenus(updatedMenus);
            }
          },
        },
      ]
    );
  };

  const handleDeleteMenuItem = async (categoryIndex, itemIndex, itemName) => {
    const categoryName = menus[categoryIndex].category;
    const deleted = await deleteItemFromMenu(
      restaurant.id,
      categoryName,
      itemName
    );
    if (deleted) {
      const updatedMenus = [...menus];
      updatedMenus[categoryIndex].items.splice(itemIndex, 1);
      setMenus(updatedMenus);
    }
  };
  const handleToggleCategory = (categoryIndex) => {
    setCategoryStates((prevState) => ({
      ...prevState,
      [categoryIndex]: !prevState[categoryIndex],
    }));
  };

  const handleCreateMenu = async () => {
    if (newMenu.trim() === "") {
      Alert.alert("menu name cannot be empty");
      return;
    }

    if (!selectedMealType || selectedMealType == "Select meal type") {
      Alert.alert("Error", "Meal type cannot be empty");
      return;
    }

    Alert.alert(
      "Confirmation",
      `This menu will be set as ${selectedMealType}. Continue?`,
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const created = await createNewMenu(
              restaurant.id,
              newMenu,
              selectedMealType
            );
            if (created) {
              setNewMenu("");
              fetchMenus();
              setCreatingMenu(false);
              setSelectedMealType("Select meal type");
              Alert.alert("Success", "New menu category created successfully");
            } else {
              console.error("Failed to create a new menu.");
              Alert.alert("Error", "Failed to create a new menu category");
            }
          },
        },
      ]
    );
  };

  const handleAddItem = async (categoryIndex, categoryName) => {
    const newItemStateForCategory = newItemStates[categoryIndex];
    if (!newItemStateForCategory.name || !newItemStateForCategory.price) {
      Alert.alert("Please enter name and price");
      return;
    }
    setLoadingImage(true);
    const itemName = newItemStateForCategory.name;
    const itemImage = newItemStateForCategory.imageSource || foodieImage;
    const itemPrice = newItemStateForCategory.price;

    const itemNameArray = [itemImage, itemPrice];

    const updated = await addItemToMenu(
      restaurant.id,
      categoryName,
      newItemStateForCategory.name,
      itemNameArray
    );
    if (updated) {
      setMenus((prevMenus) => {
        const updatedMenus = [...prevMenus];
        const categoryMenu = updatedMenus[categoryIndex].items;
        categoryMenu.push({
          title: itemName,
          imageSource: itemImage,
          price: itemPrice,
        });
        return updatedMenus;
      });
      setNewItemStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[categoryIndex] = {
          name: "",
          imageSource: foodieImage,
          price: "",
        };
        return updatedStates;
      });

      setAddingItem(false);
      setSelectedImage(foodieImage);
      setLoadingImage(false);
    } else {
      console.error("Failed to add an item to the menu.");
      setLoadingImage(false);
    }
  };

  const openImagePicker = async (categoryIndex) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!pickerResult.canceled) {
      const selectedAsset = pickerResult.assets[0];
      setNewItemStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[categoryIndex] = {
          ...prevStates[categoryIndex],
          imageSource: selectedAsset.uri,
        };
        return updatedStates;
      });
      setLoadingImage(false);
    } else {
      setNewItemStates((prevStates) => {
        const updatedStates = [...prevStates];
        updatedStates[categoryIndex] = {
          ...prevStates[categoryIndex],
          imageSource: foodieImage,
        };
        return updatedStates;
      });
      setLoadingImage(false);
    }
  };

  const handleDeleteRestaurant = (id) => {
    Alert.alert(
      "Delete Restaurant", // Alert Title
      `Are you sure you want to delete ${restaurant.name}?`, // Alert Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteRestaurant(id)
              .then(() => {
                Alert.alert("Restaurant deleted successfully");
                navigation.goBack();
              })
              .catch((error) => {
                console.error("Failed to delete restaurant: ", error);
              });
          },
        },
      ]
    );
  };

  const DeleteIcon = ({ categoryIndex, itemIndex, title, handleDelete }) => {
    return (
      <Icon
        name="delete-forever"
        color="red"
        size={18}
        onPress={() => handleDelete(categoryIndex, itemIndex, title)}
        style={{ marginTop: 20 }}
      />
    );
  };

  const handleCancel = () => {
    setSelectedMealType("Select meal type");
    setCreatingMenu(false);
    setNewMenu("");
  };

  const handleCancelItem = (categoryIndex, categoryName) => {
    setNewItemStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[categoryIndex] = {
        name: "",
        imageSource: foodieImage,
        price: "",
      };
      return updatedStates;
    });

    setAddingItem(false);
    setSelectedImage(foodieImage);
    setLoadingImage(false);
  };

  return (
    <TabLink>
      <RestaurantAdminInfo restaurant={restaurant} />
      <ScrollView style={styles.container}>
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity
            onPress={() => setCreatingMenu(true)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add New Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteRestaurant(restaurant.id)}
          >
            <Text style={styles.deleteButton}>Delete Restaurant</Text>
          </TouchableOpacity>
        </View>
        {creatingMenu && (
          <View>
            <TextInput
              placeholder="Enter menu name"
              value={newMenu}
              onChangeText={(text) => setNewMenu(text)}
              style={{
                padding: 10,
                margin: 10,
                borderColor: "gray",
                borderWidth: 1,
              }}
            />
            <View
              style={{
                margin: 10,
                borderColor: "gray",
                borderWidth: 1,
              }}
            >
              <Picker
                selectedValue={selectedMealType}
                onValueChange={(itemValue) => setSelectedMealType(itemValue)}
              >
                <Picker.Item
                  label="Select meal type"
                  value={null}
                  color={colors.brand.primary}
                  enabled={false}
                />
                <Picker.Item label="Rice Meal" value="Rice Meal" />
                <Picker.Item label="Swallow Meal" value="Swallow Meal" />
                <Picker.Item label="Others" value="Others" />
              </Picker>
            </View>
            <Spacer position="bottom" size="large" />
            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <TouchableOpacity onPress={handleCreateMenu}>
                <Text
                  style={{
                    backgroundColor: colors.brand.primary,
                    padding: 7,
                    borderRadius: 15,
                    color: "white",
                  }}
                >
                  Save Menu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel}>
                <Text
                  style={{
                    backgroundColor: colors.brand.primary,
                    padding: 7,
                    borderRadius: 15,
                    color: "white",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Spacer position="bottom" size="large" />
        {menus.map((menu, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => handleToggleCategory(categoryIndex)}
              >
                <Text variant="label">{menu.category}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleDeleteCategory(categoryIndex, menu.category)
                }
              >
                <Text variant="caption" style={{ color: "red" }}>
                  Delete Menu
                </Text>
              </TouchableOpacity>
            </View>
            <Spacer position="top" size="large" />
            {categoryStates[categoryIndex] && (
              <>
                {menu.items.length > 0
                  ? menu.items.map((item, itemIndex) => (
                      <TouchableOpacity
                        key={itemIndex}
                        style={{ flexDirection: "row", marginBottom: 10 }}
                        onPress={() => {
                          console.log(
                            "menu type",
                            menus[categoryIndex].menuType
                          );
                          navigation.navigate("MealOption", {
                            name: item.title,
                            imageSource: item.imageSource,
                            restaurant: restaurant,
                            price: item.price,
                            menuType: menus[categoryIndex].menuType,
                          });
                        }}
                      >
                        {item.imageSource ? (
                          <Image
                            source={
                              typeof item.imageSource === "string"
                                ? { uri: item.imageSource }
                                : item.imageSource
                            }
                            style={{ width: 100, height: 100 }}
                          />
                        ) : (
                          <Image
                            source={foodieImage}
                            style={{ width: 100, height: 100 }}
                          />
                        )}
                        <View
                          style={{ flex: 1, marginLeft: 20, marginTop: 20 }}
                        >
                          <PaperText>{item.title}</PaperText>
                          <PaperText
                            variant="bodyMedium"
                            style={{ color: colors.text.success }}
                          >
                            Price: {item.price}
                          </PaperText>
                        </View>
                        <DeleteIcon
                          categoryIndex={categoryIndex}
                          itemIndex={itemIndex}
                          title={item.title}
                          handleDelete={handleDeleteMenuItem}
                        />
                      </TouchableOpacity>
                    ))
                  : null}
                <Spacer />
                <TouchableOpacity onPress={() => setAddingItem(true)}>
                  <Text style={{ textAlign: "center" }} variant="caption">
                    {" "}
                    Add New Meal to {menu.category}
                  </Text>
                </TouchableOpacity>
                {addingItem && (
                  <View>
                    <TextInput
                      placeholder="Item Name"
                      value={newItemStates[categoryIndex].name}
                      onChangeText={(text) =>
                        setNewItemStates((prevState) =>
                          prevState.map((itemState, idx) =>
                            idx === categoryIndex
                              ? { ...itemState, name: text }
                              : itemState
                          )
                        )
                      }
                      style={{
                        padding: 10,
                        margin: 10,
                        borderColor: "gray",
                        borderWidth: 1,
                      }}
                    />
                    <TextInput
                      placeholder="Item Price"
                      value={newItemStates[categoryIndex].price}
                      onChangeText={(text) =>
                        setNewItemStates((prevState) =>
                          prevState.map((itemState, idx) =>
                            idx === categoryIndex
                              ? { ...itemState, price: text }
                              : itemState
                          )
                        )
                      }
                      style={{
                        padding: 10,
                        margin: 10,
                        borderColor: "gray",
                        borderWidth: 1,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => openImagePicker(categoryIndex)}
                      >
                        <Text
                          style={{
                            backgroundColor: colors.brand.primary,
                            color: "white",
                            padding: 3,
                            borderRadius: 10,
                          }}
                        >
                          Select Image
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleAddItem(categoryIndex, menu.category)
                        }
                      >
                        <Text
                          style={{
                            backgroundColor: colors.brand.primary,
                            color: "white",
                            padding: 3,
                            borderRadius: 10,
                          }}
                        >
                          Save
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleCancelItem(categoryIndex, menu.category)
                        }
                      >
                        <Text
                          style={{
                            backgroundColor: colors.brand.primary,
                            color: "white",
                            padding: 3,
                            borderRadius: 10,
                          }}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </TabLink>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  headerButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  deleteButton: {
    color: "red",
    backgroundColor: colors.ui.quaternary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f1f1f1",
    marginBottom: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: colors.brand.muted,
  },
  addButton: {
    backgroundColor: colors.brand.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  categoryContainer: {
    backgroundColor: colors.ui.quaternary,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 5,
  },
});
