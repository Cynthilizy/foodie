import React, { useContext, useEffect } from "react";
import { TabLink } from "../stylings/restaurant-info.styles";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import { List, Avatar } from "react-native-paper";
import styled from "styled-components/native";
import { Text } from "../styles/text.styles";
import { Spacer } from "../styles/spacer.styles";
import { TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { colors } from "../styles/colors.styles";
import Icon from "react-native-vector-icons/Ionicons";
import * as MailComposer from "expo-mail-composer";

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

export const RidersSettingsScreen = ({ navigation }) => {
  const { onLogoutRider, rider, profilePicUrlRider } = useContext(
    AuthenticationContextRider
  );

  const SendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      MailComposer.composeAsync({
        recipients: ["cynthilizy@gmail.com"],
        subject: `"Rider ID: ${rider.phoneRider} `,
        body: "Please enter your message here.",
      })
        .then((result) => {
          if (result.status === "sent") {
            Alert.alert(
              "Email Sent",
              "Your message has been sent. We will reply by email soon."
            );
          }
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          Alert.alert("Error", "Failed to send email. Please try again later.");
        });
    } else {
      Alert.alert(
        "Email Composer Not Available",
        "The email composer is not available on your device."
      );
    }
  };

  return (
    <SettingsBackground>
      <TransparentSafeArea>
        <AvatarContainer>
          {!profilePicUrlRider && (
            <Avatar.Icon
              size={180}
              icon="human"
              backgroundColor={colors.brand.primary}
            />
          )}
          {profilePicUrlRider && (
            <Avatar.Image
              size={180}
              source={{ uri: profilePicUrlRider }}
              backgroundColor="#2182BD"
            />
          )}
          <Spacer position="top" size="large">
            <Text variant="label">{rider ? rider.nameRider : ""}</Text>
          </Spacer>
        </AvatarContainer>
        <List.Section>
          <SettingsItem
            title="Rider Information"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.secondary} icon="human" />
            )}
            onPress={() => navigation.navigate("RiderInfo")}
          />
          <Spacer />
          <SettingsItem
            title="Contact Us"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.secondary} icon="phone" />
            )}
            onPress={SendEmail}
          />
          <Spacer />
          <SettingsItem
            title="Logout"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.secondary} icon="door" />
            )}
            onPress={() => onLogoutRider(navigation)}
          />
        </List.Section>
      </TransparentSafeArea>
    </SettingsBackground>
  );
};
