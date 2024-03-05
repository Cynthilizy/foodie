import React, { useContext, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  Button,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { styled } from "styled-components/native";
import { RestaurantList } from "../stylings/restaurant-list.styles";
import { RestaurantsAdminContext } from "../context/restaurantAdmin.context";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import foodieImage from "../../assets/foodie.png";
import { Text } from "../styles/text.styles";
import { createNewRestaurant } from "../service/firestore.service";
import { updateRestaurantPhoto } from "../service/firestore.service";
import { Spacer } from "../styles/spacer.styles";
import { RestaurantAdminInfo } from "../features/restaurantAdmin-info";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../service/firebase.service";

const isAndroid = Platform.OS === "android";

const Container = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${isAndroid ? StatusBar.currentHeight : 0}px;
  background-color: ${(props) => props.theme.colors.bg.primary};
`;

const RestaurantDetails = styled.View`
  flex: 1;
  backgroundcolor: ${(props) => props.theme.colors.bg.secondary};
`;

const LoadingCover = styled(View)`
  position: absolute;
  margin-top: 100%;
  margin-left: 35%;
`;

const FormContainer = styled.View`
  padding: 30px;
  background-color: #fff;
  border-radius: 15px;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 12px;
  border-radius: 5px;
  margin-top: 10px;
`;

const StyledButtonText = styled.Text`
  color: white;
  text-align: center;
  font-weight: bold;
`;

const FancyTextInput = styled.TextInput`
  border: 1px solid #3498db;
  border-radius: 5px;
  padding: 12px;
  margin: 10px 0;
  font-size: 18px;
`;

export const RestaurantsAdminScreen = ({ navigation }) => {
  const { isLoading, error, restaurants } = useContext(RestaurantsAdminContext);
  const [openForm, setOpenForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeField, setTimeField] = useState("");
  const [imagePickerId, setImagePickerId] = useState(null);
  const [newRestaurant, setNewRestaurant] = useState({
    address: "",
    name: "",
    ownerName: "",
    openingHours: "00:00",
    closingHours: "00:00",
    imagePickerId,
  });

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDateToTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}`;
  };

  const handleCancel = () => {
    setNewRestaurant({
      address: "",
      name: "",
      ownerName: "",
      openingHours: "00:00",
      closingHours: "00:00",
      imagePickerId,
    });
    setOpenForm(false);
  };

  const handlePickImage = async () => {
    const randomId = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .substring(7)}`;
    try {
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
        const { uri } = pickerResult.assets[0];
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const ref = storageRef(
            storage,
            `restaurant_photo/restaurants/${randomId}`
          );
          await uploadBytes(ref, blob);
          const downloadURL = await getDownloadURL(ref);
          console.log("File available at", downloadURL);
          setImagePickerId(downloadURL);
          setNewRestaurant({
            ...newRestaurant,
            imagePickerId: downloadURL,
          });
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    } catch (error) {
      console.error("Error accessing camera roll permissions:", error);
    }
  };

  useEffect(() => {
    console.log("imagePickerId updated:", imagePickerId);
  }, [imagePickerId]);

  const handleSubmit = async () => {
    if (
      !newRestaurant.name ||
      !newRestaurant.address ||
      !newRestaurant.ownerName
    ) {
      alert("Some fields are empty. Please fill all the details.");
      return;
    }
    const {
      name,
      address,
      ownerName,
      openingHours,
      closingHours,
      imagePickerId,
    } = newRestaurant;

    try {
      const newId = await createNewRestaurant(
        name,
        address,
        openingHours,
        closingHours,
        ownerName,
        imagePickerId
      );

      setNewRestaurant({
        address: "",
        name: "",
        ownerName: "",
        openingHours: "00:00",
        closingHours: "00:00",
        imagePickerId: null,
      });
      setOpenForm(false);
    } catch (error) {
      console.error("Error creating new restaurant:", error);
      // Handle error if creating new restaurant or uploading image fails
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = formatDateToTime(selectedTime);
      setNewRestaurant({
        ...newRestaurant,
        [timeField]: formattedTime,
      });
    }
  };

  return (
    <Container>
      {isLoading && (
        <LoadingCover>
          <ActivityIndicator size={50} animating={true} color="#0000FF" />
        </LoadingCover>
      )}
      <TextInput
        placeholder="Search for restaurants"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        style={{ padding: 10, margin: 10, borderColor: "gray", borderWidth: 1 }}
      />
      <Button title="Add New Restaurant" onPress={() => setOpenForm(true)} />
      <Modal visible={openForm} animationType="slide">
        <FormContainer>
          <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>
            Add New Restaurant
          </Text>

          <FancyTextInput
            placeholder="Restaurant Name"
            value={newRestaurant.name}
            onChangeText={(text) =>
              setNewRestaurant({ ...newRestaurant, name: text })
            }
          />

          <FancyTextInput
            placeholder="Restaurant Address"
            value={newRestaurant.address}
            onChangeText={(text) =>
              setNewRestaurant({ ...newRestaurant, address: text })
            }
          />

          <FancyTextInput
            placeholder="Restaurant Owner"
            value={newRestaurant.ownerName}
            onChangeText={(text) =>
              setNewRestaurant({ ...newRestaurant, ownerName: text })
            }
          />
          <TouchableOpacity
            onPress={() => {
              setShowTimePicker(true);
              setTimeField("openingHours");
            }}
          >
            <Text>Select Opening Hours: {newRestaurant.openingHours}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowTimePicker(true);
              setTimeField("closingHours");
            }}
          >
            <Spacer />
            <Text>Select Closing Hours: {newRestaurant.closingHours}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode={"time"}
              display="default"
              onChange={handleTimeChange}
            />
          )}
          <StyledButton onPress={handlePickImage}>
            <StyledButtonText>Pick an image</StyledButtonText>
          </StyledButton>

          <StyledButton onPress={handleSubmit}>
            <StyledButtonText>Submit</StyledButtonText>
          </StyledButton>

          <StyledButton onPress={handleCancel}>
            <StyledButtonText>Cancel</StyledButtonText>
          </StyledButton>
        </FormContainer>
      </Modal>
      <RestaurantDetails>
        <RestaurantList
          data={filteredRestaurants}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RestaurantAdminDetail", {
                    restaurant: item,
                  })
                }
              >
                <Spacer position="bottom" size="large">
                  <RestaurantAdminInfo restaurant={item} />
                </Spacer>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.name}
        />
      </RestaurantDetails>
    </Container>
  );
};
