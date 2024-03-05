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
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import { Text } from "../styles/text.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import { Spacer } from "../styles/spacer.styles";
import { colors } from "../styles/colors.styles";
import Icon from "react-native-vector-icons/Ionicons";

export const RiderInfoScreen = ({ navigation }) => {
  const {
    rider,
    isLoadingRider,
    setIsLoadingRider,
    profilePicUrlRider,
    UpdateEmailRider,
  } = useContext(AuthenticationContextRider);
  const [email, setEmail] = useState(rider.emailRider || "");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const handleEmailSave = async (newEmail) => {
    setIsLoadingRider(true);
    const updateSuccess = await UpdateEmailRider(newEmail);
    setIsLoadingRider(false);
    if (updateSuccess) {
      Alert.alert("Updated Successfully");
      setShowEmailInput(false);
    } else {
      Alert.alert("Update Failed, invalid format");
      setEmail(rider.emailRider);
    }
  };

  return (
    <TabLink>
      {!profilePicUrlRider && (
        <View style={styles.imageContainer}>
          <Avatar.Icon
            size={180}
            icon="human"
            backgroundColor={colors.brand.primary}
          />
          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={() => navigation.navigate("CameraRider")}
          >
            <Icon name="camera-outline" size={35} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      {profilePicUrlRider && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: profilePicUrlRider }}
            style={styles.profileImage}
          />
        </View>
      )}
      <ScrollView>
        <>
          <View style={{ backgroundColor: "#f2f2f2", padding: 10 }}>
            <Text>
              Username : <Text variant="label">{rider.nameRider}</Text>
            </Text>
            <Divider />
            <Spacer position="top" size="large" />
            <Text>
              Phone : <Text variant="label">{rider.phoneRider}</Text>
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
                    loading={isLoadingRider}
                    onPress={() => handleEmailSave(email)}
                  >
                    Save Email Changes
                  </Button>
                  <Button
                    mode="contained"
                    loading={isLoadingRider}
                    onPress={() => {
                      setShowEmailInput(false);
                      setEmail(rider.emailRider);
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
