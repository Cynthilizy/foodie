import React, { useContext } from "react";
import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";
import { FavouritesContext } from "../context/favourite.context";
import { Text } from "../styles/text.styles";
import { Spacer } from "../styles/spacer.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import { RestaurantList } from "../stylings/restaurant-list.styles";
import { RestaurantInfo } from "../features/restaurant-info";

const NoFavouritesArea = styled(TabLink)`
  align-items: center;
  justify-content: center;
`;
export const FavouritesScreen = ({ navigation }) => {
  const { favourites } = useContext(FavouritesContext);

  return favourites.length ? (
    <TabLink>
      <RestaurantList
        data={favourites}
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
    </TabLink>
  ) : (
    <NoFavouritesArea>
      <Text center>No favourites yet</Text>
    </NoFavouritesArea>
  );
};
