import React, { useContext, useEffect } from "react";
import { TabLink } from "../stylings/restaurant-info.styles";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { List, Avatar } from "react-native-paper";
import styled from "styled-components/native";
import { Text } from "../styles/text.styles";
import { Spacer } from "../styles/spacer.styles";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../styles/colors.styles";

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

export const SettingsAdminScreen = ({ navigation }) => {
  const { onLogout, userAdmin } = useContext(AuthenticationContextAdmin);

  return (
    <SettingsBackground>
      <TransparentSafeArea>
        <AvatarContainer>
          <View>
            <Avatar.Image
              size={180}
              source={require("../../assets/foodie.png")}
              backgroundColor="#2182BD"
            />
          </View>
          <Spacer position="top" size="large">
            <Text variant="label">{`Logged in as ${
              userAdmin ? userAdmin.username : ""
            }`}</Text>
          </Spacer>
        </AvatarContainer>
        <List.Section>
          <SettingsItem
            title="Riders Online"
            left={(props) => (
              <List.Icon {...props} color={colors.ui.secondary} icon="human" />
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
