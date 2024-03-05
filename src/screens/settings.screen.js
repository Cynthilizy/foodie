import React, { useContext, useEffect } from "react";
import { TabLink } from "../stylings/restaurant-info.styles";
import { AuthenticationContextCustomer } from "../context/authenticationCustomer.context";
import { List, Avatar } from "react-native-paper";
import styled from "styled-components/native";
import { Text } from "../styles/text.styles";
import { Spacer } from "../styles/spacer.styles";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../styles/colors.styles";
import Icon from "react-native-vector-icons/Ionicons";

const TransparentSafeArea = styled(TabLink)`
  background-color: transparent;
`;

export const SettingsBackground = styled.ImageBackground.attrs({
  source: require("../../assets/home_bg.jpg"),
})`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const SettingsItem = styled(List.Item)`
  padding: ${(props) => props.theme.space[3]};
  background-color: rgba(255, 255, 255, 0.4);
`;

const AvatarContainer = styled.View`
  align-items: center;
`;

export const SettingsScreen = ({ navigation }) => {
  const { onLogout, user, profilePictureURL } = useContext(
    AuthenticationContextCustomer
  );

  return (
    <SettingsBackground>
      <TransparentSafeArea>
        <AvatarContainer>
          {!profilePictureURL && (
            <View>
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
          {profilePictureURL && (
            <View>
              <Avatar.Image
                size={180}
                source={{ uri: profilePictureURL }}
                backgroundColor="#2182BD"
              />
              <TouchableOpacity
                style={styles.cameraIconContainer}
                onPress={() => navigation.navigate("Camera")}
              >
                <Icon name="camera-outline" size={35} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <Spacer position="top" size="large">
            <Text variant="label">{user ? user.name : ""}</Text>
          </Spacer>
        </AvatarContainer>
        <List.Section>
          <SettingsItem
            title="User Information"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.secondary} icon="human" />
            )}
            onPress={() => navigation.navigate("UserInfo")}
          />
          <Spacer />
          <SettingsItem
            title="Favourites"
            description="View your favourite restaurants"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.error} icon="heart" />
            )}
            onPress={() => navigation.navigate("Favourites")}
          />
          <Spacer />
          <SettingsItem
            title="Payment Cards"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.secondary} icon="cart" />
            )}
            onPress={() => null}
          />
          <Spacer />
          <SettingsItem
            title="Past Orders"
            left={(props) => (
              <List.Icon
                {...props}
                color={colors.ui.secondary}
                icon="history"
              />
            )}
            onPress={() => null}
          />
          <Spacer />
          <SettingsItem
            title="Contact Us"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.secondary} icon="phone" />
            )}
            onPress={() => null}
          />
          <Spacer />
          <SettingsItem
            title="Logout"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.secondary} icon="door" />
            )}
            onPress={() => onLogout(navigation)}
          />
        </List.Section>
      </TransparentSafeArea>
    </SettingsBackground>
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
    right: 110, // adjust these as needed
    bottom: 17, // adjust these as needed
    backgroundColor: "transparent", // semi-transparent
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
