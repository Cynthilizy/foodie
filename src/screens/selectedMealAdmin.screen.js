import React, { useState, useContext, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { List, Divider } from "react-native-paper";
import { TabLink } from "../stylings/restaurant-info.styles";
import { colors } from "../styles/colors.styles";
import { Spacer } from "../styles/spacer.styles";
import * as ImagePicker from "expo-image-picker";
import { Text } from "../styles/text.styles";
import { MealInfoAdmin } from "../features/meal-Card-Admin";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { deleteItemFromArrayInCategory } from "../service/firestore.service";
import { addNewItemToArrayInCategory } from "../service/firestore.service";
import foodieImage from "../../assets/foodie.png";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export const MealOptionScreen = ({ route }) => {
  const { name, imageSource, price, restaurant, menuType } = route.params;
  const { fetchMenuByRestaurantId } = useContext(AuthenticationContextAdmin);
  const [proteinList, setProteinList] = useState([]);
  const [swallowList, setSwallowList] = useState([]);
  const [sidesList, setSidesList] = useState([]);
  const [drinksList, setDrinksList] = useState([]);
  const [mealType, setMealType] = useState("");
  const [addingItem, setAddingItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemImage, setNewItemImage] = useState(null);

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

  const handleDeleteItem = async (categoryName, itemName) => {
    console.log("item", itemName);
    const success = await deleteItemFromArrayInCategory(
      restaurant.id,
      categoryName,
      itemName
    );
    if (success) {
      console.log(`Item '${itemName}' deleted from '${categoryName}'`);
      fetchMenus();
    }
  };

  const handleAddNewItem = async (categoryName) => {
    if (!newItemName || !newItemPrice) {
      alert("Please enter item name and price.");
      return;
    }
    const itemName = newItemName;
    const itemPrice = newItemPrice;
    const defaultItemArray = [newItemImage || foodieImage, itemPrice];
    const success = await addNewItemToArrayInCategory(
      restaurant.id,
      categoryName,
      itemName,
      defaultItemArray
    );
    if (success) {
      fetchMenus();
      setAddingItem(null);
      setNewItemName("");
      setNewItemPrice("");
      setNewItemImage(null);
    }
  };

  const DeleteIcon = ({ categoryName, itemName }) => {
    return (
      <Icon
        name="delete-forever"
        color="red"
        size={18}
        onPress={() => handleDeleteItem(categoryName, itemName)}
        style={{ marginTop: 20 }}
      />
    );
  };

  const ListItemWithDelete = ({ item, categoryName, onDelete }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
      }}
    >
      {item.image ? (
        typeof item.image === "number" ? (
          <Image
            source={item.image}
            style={{ width: 50, height: 50, marginRight: 16 }}
          />
        ) : (
          <Image
            source={{ uri: item.image }}
            style={{ width: 50, height: 50, marginRight: 16 }}
          />
        )
      ) : (
        <Image
          source={foodieImage}
          style={{ width: 50, height: 50, marginRight: 16 }}
        />
      )}
      <View style={{ flex: 1 }}>
        <List.Item title={item.name} description={`Price: ${item.price}`} />
      </View>
      <DeleteIcon
        categoryName={categoryName}
        itemName={item.name}
        onDelete={onDelete}
      />
    </View>
  );

  const openImagePicker = async () => {
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
      setNewItemImage(pickerResult.uri);
    } else {
      setNewItemImage(foodieImage);
    }
  };

  return (
    <TabLink>
      <MealInfoAdmin
        meal={{
          name: name,
          photo: imageSource,
          price: price,
        }}
      />
      <Spacer position="bottom" size="medium" />
      <ScrollView>
        <List.Accordion
          title="Protein"
          expanded={mealType === "Protein"}
          onPress={() => setMealType(mealType === "Protein" ? "" : "Protein")}
        >
          {proteinList.map((item, index) => (
            <ListItemWithDelete
              key={item.name}
              item={item}
              categoryName="proteinMenu"
              onDelete={() => handleDeleteItem(categoryName, item.name)}
            />
          ))}
          <Spacer position="bottom" size="medium" />
          <TouchableOpacity onPress={() => setAddingItem("proteinMenu")}>
            <Text
              variant="caption"
              style={{
                backgroundColor: colors.brand.primary,
                color: "white",
                padding: 3,
                borderRadius: 10,
                textAlign: "center",
                width: 200,
                alignSelf: "center",
              }}
            >
              Add New Item To Protein List
            </Text>
          </TouchableOpacity>
        </List.Accordion>
        <Spacer position="bottom" size="large" />
        <Divider />
        {menuType !== "Rice Meal" && menuType !== "Others" && (
          <List.Accordion
            title="Swallow"
            expanded={mealType === "Swallow"}
            onPress={() => setMealType(mealType === "Swallow" ? "" : "Swallow")}
          >
            {swallowList.map((item, index) => (
              <ListItemWithDelete
                key={item.name}
                item={item}
                categoryName="swallowSelection"
                onDelete={() => handleDeleteItem(categoryName, item.name)}
              />
            ))}
            <Spacer position="bottom" size="medium" />
            <TouchableOpacity onPress={() => setAddingItem("swallowSelection")}>
              <Text
                variant="caption"
                style={{
                  backgroundColor: colors.brand.primary,
                  color: "white",
                  padding: 3,
                  borderRadius: 10,
                  textAlign: "center",
                  width: 200,
                  alignSelf: "center",
                }}
              >
                Add New Item To Swallow List
              </Text>
            </TouchableOpacity>
          </List.Accordion>
        )}
        <Spacer position="bottom" size="large" />
        <Divider />
        {menuType !== "Swallow Meal" && menuType !== "Others" && (
          <List.Accordion
            title="Sides"
            expanded={mealType === "Sides"}
            onPress={() => setMealType(mealType === "Sides" ? "" : "Sides")}
          >
            {sidesList.map((item, index) => (
              <ListItemWithDelete
                key={item.name}
                item={item}
                categoryName="sidesMenu"
                onDelete={() => handleDeleteItem(categoryName, item.name)}
              />
            ))}
            <Spacer position="bottom" size="medium" />
            <TouchableOpacity onPress={() => setAddingItem("sidesMenu")}>
              <Text
                variant="caption"
                style={{
                  backgroundColor: colors.brand.primary,
                  color: "white",
                  padding: 3,
                  borderRadius: 10,
                  textAlign: "center",
                  width: 200,
                  alignSelf: "center",
                }}
              >
                Add New Item To Sides List
              </Text>
            </TouchableOpacity>
          </List.Accordion>
        )}
        <Spacer position="bottom" size="large" />
        <Divider />

        <List.Accordion
          title="Drinks"
          expanded={mealType === "Drinks"}
          onPress={() => setMealType(mealType === "Drinks" ? "" : "Drinks")}
        >
          {drinksList.map((item, index) => (
            <ListItemWithDelete
              key={item.name}
              item={item}
              categoryName="drinksMenu"
              onDelete={() => handleDeleteItem(categoryName, item.name)}
            />
          ))}
          <Spacer position="bottom" size="medium" />
          <TouchableOpacity onPress={() => setAddingItem("drinksMenu")}>
            <Text
              variant="caption"
              style={{
                backgroundColor: colors.brand.primary,
                color: "white",
                padding: 3,
                borderRadius: 10,
                textAlign: "center",
                width: 200,
                alignSelf: "center",
              }}
            >
              Add New Item To Drinks List
            </Text>
          </TouchableOpacity>
        </List.Accordion>
      </ScrollView>
      {addingItem !== null && (
        <Modal>
          <TextInput
            placeholder="Item Name"
            value={newItemName}
            onChangeText={setNewItemName}
            style={{
              padding: 10,
              margin: 10,
              borderColor: "gray",
              borderWidth: 1,
            }}
          />
          <TextInput
            placeholder="Item Price"
            value={newItemPrice}
            onChangeText={setNewItemPrice}
            style={{
              padding: 10,
              margin: 10,
              borderColor: "gray",
              borderWidth: 1,
            }}
          />
          <TouchableOpacity onPress={openImagePicker}>
            <Text
              style={{
                backgroundColor: colors.brand.primary,
                color: "white",
                padding: 3,
                borderRadius: 10,
                width: 100,
                textAlign: "center",
                alignSelf: "center",
              }}
            >
              Select Image
            </Text>
          </TouchableOpacity>
          <Spacer position="bottom" size="large" />
          {newItemImage && (
            <Image
              source={{ uri: newItemImage }}
              style={{ width: 100, height: 100, margin: 10 }}
            />
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity onPress={() => handleAddNewItem(addingItem)}>
              <Text
                style={{
                  backgroundColor: colors.brand.primary,
                  color: "white",
                  padding: 3,
                  width: 70,
                  textAlign: "center",
                  borderRadius: 10,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAddingItem(null);
                setNewItemName("");
                setNewItemPrice("");
                setNewItemImage(null);
              }}
            >
              <Text
                style={{
                  backgroundColor: colors.brand.primary,
                  color: "white",
                  padding: 3,
                  width: 70,
                  textAlign: "center",
                  borderRadius: 10,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </TabLink>
  );
};
