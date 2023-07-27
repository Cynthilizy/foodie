import React, { useContext, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import {
  SafeAreaView,
  StatusBar,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import { styled } from "styled-components/native";
import { RestaurantInfo } from "../features/restaurant-info";
import { Spacer } from "../styles/spacer.styles";
import { Text } from "../styles/text.styles";
import { RestaurantList } from "../stylings/restaurant-list.styles";
import { RestaurantsContext } from "../context/restaurant.context";

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

export const RestaurantsScreen = ({ navigation }) => {
  const { isLoading, error, restaurants } = useContext(RestaurantsContext);
  return (
    <Container>
      {isLoading && (
        <LoadingCover>
          <ActivityIndicator size={50} animating={true} color="#0000FF" />
        </LoadingCover>
      )}
      <RestaurantDetails>
        <RestaurantList
          data={restaurants}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("RestaurantDetail", {
                    restaurant: item,
                  })
                }
              >
                <Spacer position="bottom" size="large">
                  <RestaurantInfo restaurant={item} />
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
