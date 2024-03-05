import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { TextInput, Button, Divider, Avatar } from "react-native-paper";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { placesRequest } from "../service/checkout.service";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import { Spacer } from "../styles/spacer.styles";
import { colors } from "../styles/colors.styles";
import Icon from "react-native-vector-icons/Ionicons";

export const UserInfoScreen = ({ navigation }) => {
  const {
    user,
    addOrUpdateAddress,
    isLoading,
    setIsLoading,
    profilePictureURL,
    addOrUpdateEmail,
    homeAddress,
    setHomeAddress,
    officeAddress,
    setOfficeAddress,
  } = useContext(AuthenticationContextCustomer);
  const [email, setEmail] = useState(user.email || "");
  const [homeSuggestions, setHomeSuggestions] = useState([]);
  const [officeSuggestions, setOfficeSuggestions] = useState([]);
  const [showHomeInput, setShowHomeInput] = useState(false);
  const [showOfficeInput, setShowOfficeInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isHomeAddressSelected, setIsHomeAddressSelected] = useState(true);
  const [isOfficeAddressSelected, setIsOfficeAddressSelected] = useState(true);
  const [tempHomeAddress, setTempHomeAddress] = useState(null);
  const [tempOfficeAddress, setTempOfficeAddress] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const keyboardSetting =
    homeSuggestions.length > 0 || officeSuggestions.length > 0
      ? "always"
      : "never";

  const fetchHomeSuggestions = async () => {
    try {
      const response = await placesRequest(tempHomeAddress);
      if (response && response.predictions) {
        setHomeSuggestions(response.predictions);
      }
    } catch (error) {
      console.error("Error fetching home address suggestions:", error);
    }
  };

  const fetchOfficeSuggestions = async () => {
    try {
      const response = await placesRequest(tempOfficeAddress);
      if (response && response.predictions) {
        setOfficeSuggestions(response.predictions);
      }
    } catch (error) {
      console.error("Error fetching office address suggestions:", error);
    }
  };

  useEffect(() => {
    if (tempHomeAddress) fetchHomeSuggestions();
    if (tempOfficeAddress) fetchOfficeSuggestions();
  }, [tempHomeAddress, tempOfficeAddress]);

  useEffect(() => {
    if (homeAddress) {
      Keyboard.dismiss();
    }
    if (officeAddress) {
      Keyboard.dismiss();
    }
  }, [homeAddress, officeAddress]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
        setIsHomeAddressSelected(true);
        setIsOfficeAddressSelected(true);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderSuggestionHome = (suggestion) => (
    <TouchableOpacity
      key={suggestion.place_id}
      onPress={async () => {
        setHomeAddress(suggestion.description);
        setTempHomeAddress(null);
        setIsHomeAddressSelected(true);
        setHomeSuggestions([]);
      }}
    >
      <Text>{suggestion.description}</Text>
    </TouchableOpacity>
  );

  const renderSuggestionOffice = (suggestion) => (
    <TouchableOpacity
      key={suggestion.place_id}
      onPress={async () => {
        setOfficeAddress(suggestion.description);
        setTempOfficeAddress(null);
        setIsOfficeAddressSelected(true);
        setOfficeSuggestions([]);
      }}
    >
      <Text>{suggestion.description}</Text>
    </TouchableOpacity>
  );

  const handleSave = async (type, address) => {
    setIsLoading(true);
    await addOrUpdateAddress(type, address);
    setIsLoading(false);
    Alert.alert("Updated Successfully");
    setShowHomeInput(false);
    setShowOfficeInput(false);
    setShowEmailInput(false);
  };

  const handleEmailSave = async (newEmail) => {
    setIsLoading(true);
    const updateSuccess = await addOrUpdateEmail(newEmail);
    setIsLoading(false);
    if (updateSuccess) {
      Alert.alert("Updated Successfully");
      setShowHomeInput(false);
      setShowOfficeInput(false);
      setShowEmailInput(false);
    } else {
      Alert.alert("Update Failed, invalid format");
      setEmail(user.email);
    }
  };

  return (
    <TabLink>
      {isHomeAddressSelected &&
        isOfficeAddressSelected &&
        !profilePictureURL && (
          <View style={styles.imageContainer}>
            <Avatar.Icon
              size={180}
              icon="human"
              backgroundColor={colors.brand.primary}
            />
            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={() => navigation.navigate("Camera")}
            >
              <Icon name="camera-outline" size={35} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      {isHomeAddressSelected &&
        isOfficeAddressSelected &&
        profilePictureURL && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: profilePictureURL }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.cameraIconContainer}
              onPress={() => navigation.navigate("Camera")}
            >
              <Icon name="camera-outline" size={35} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      <ScrollView keyboardShouldPersistTaps={keyboardSetting}>
        {isHomeAddressSelected && isOfficeAddressSelected && (
          <>
            <View style={{ backgroundColor: "#f2f2f2", padding: 10 }}>
              <Text>
                Username : <Text variant="label">{user.name}</Text>
              </Text>
              <Divider />
              <Spacer position="top" size="large" />
              <Text>
                Phone : <Text variant="label">{user.phone}</Text>
              </Text>
              <Divider />
              <Spacer position="top" size="large" />
              <Text>
                Email : <Text variant="label">{email}</Text>
              </Text>
              <Button onPress={() => setShowEmailInput(true)}>
                Update Email
              </Button>
              {showEmailInput && (
                <View>
                  <TextInput
                    label="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                  />
                  <Spacer position="top" size="small" />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      mode="contained"
                      loading={isLoading}
                      onPress={() => handleEmailSave(email)}
                    >
                      Save Email Changes
                    </Button>
                    <Button
                      mode="contained"
                      loading={isLoading}
                      onPress={() => {
                        setShowEmailInput(false);
                        setEmail(user.email);
                      }}
                    >
                      Cancel
                    </Button>
                  </View>
                </View>
              )}
              <Spacer position="top" size="small" />
              <Divider />
            </View>
          </>
        )}
        <Spacer position="top" size="large" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ flexShrink: 1, flex: 1 }} numberOfLines={2}>
            Home Address : <Text variant="label">{user.homeAddress}</Text>
          </Text>
          {homeAddress && isKeyboardVisible && (
            <Button
              onPress={() => {
                setHomeAddress(null);
                setTempHomeAddress(null);
                setIsHomeAddressSelected(false);
              }}
              mode="contained"
              style={{
                backgroundColor: colors.brand.primary,
                borderRadius: 70,
                marginRight: 8,
              }}
            >
              Clear
            </Button>
          )}
        </View>
        <Button onPress={() => setShowHomeInput(true)}>
          Update Home Address
        </Button>
        {showHomeInput && (
          <View>
            <TextInput
              placeholder={homeAddress}
              value={tempHomeAddress}
              onFocus={() => setIsHomeAddressSelected(false)}
              onChangeText={(text) => {
                setTempHomeAddress(text);
                setIsHomeAddressSelected(false);
              }}
            />
            {!isHomeAddressSelected &&
              homeSuggestions.map(renderSuggestionHome)}
            <Spacer position="top" size="small" />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {homeAddress && (
                <Button
                  mode="contained"
                  disabled={!isHomeAddressSelected || isLoading}
                  onPress={() => handleSave("homeAddress", homeAddress)}
                >
                  Save new address
                </Button>
              )}
              <Button
                mode="contained"
                disabled={!isHomeAddressSelected || isLoading}
                onPress={() => {
                  setShowHomeInput(false);
                  setHomeAddress(homeAddress);
                }}
              >
                Cancel
              </Button>
            </View>
          </View>
        )}
        <Spacer position="top" size="small" />
        <Divider />
        <Spacer position="top" size="large" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ flexShrink: 1, flex: 1 }} numberOfLines={2}>
            Office Address : <Text variant="label">{user.officeAddress}</Text>
          </Text>
          {officeAddress && isKeyboardVisible && (
            <Button
              onPress={() => {
                setOfficeAddress(null);
                setTempOfficeAddress(null);
                setIsOfficeAddressSelected(false);
              }}
              mode="contained"
              style={{
                backgroundColor: colors.brand.primary,
                borderRadius: 70,
                marginRight: 8,
              }}
            >
              Clear
            </Button>
          )}
        </View>
        <Button onPress={() => setShowOfficeInput(true)}>
          Update Office Address
        </Button>
        {showOfficeInput && (
          <View>
            <TextInput
              placeholder={officeAddress}
              value={tempOfficeAddress}
              onFocus={() => setIsOfficeAddressSelected(false)}
              onChangeText={(text) => {
                setTempOfficeAddress(text);
                setIsOfficeAddressSelected(false);
              }}
            />
            {!isOfficeAddressSelected &&
              officeSuggestions.map(renderSuggestionOffice)}
            <Spacer position="top" size="small" />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {officeAddress && (
                <Button
                  mode="contained"
                  disabled={!isOfficeAddressSelected || isLoading}
                  loading={isLoading}
                  onPress={() => handleSave("officeAddress", officeAddress)}
                >
                  Save new address
                </Button>
              )}
              <Button
                mode="contained"
                disabled={!isOfficeAddressSelected || isLoading}
                loading={isLoading}
                onPress={() => {
                  setShowOfficeInput(false);
                  setOfficeAddress(officeAddress);
                }}
              >
                Cancel
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </TabLink>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 75,
  },
  cameraIconContainer: {
    position: "absolute",
    right: 110,
    bottom: 17,
    backgroundColor: "transparent",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
