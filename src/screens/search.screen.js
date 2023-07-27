import React, { useState, useContext } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { styled } from "styled-components/native";
import { TabLink } from "../stylings/restaurant-info.styles";
import { RestaurantsContext } from "../context/restaurant.context";
import { RestaurantInfo } from "../features/restaurant-info";
import { Spacer } from "../styles/spacer.styles";
import { Text } from "../styles/text.styles";
import { colors } from "../styles/colors.styles";

const SearchContainer = styled.View`
  padding: ${(props) => props.theme.space[3]};
`;
const CenterText = styled(Text)`
  text-align: center;
  font-weight: bold;
`;

const CenterView = styled(View)`
  align-items: center;
  margin-top: ${(props) => props.theme.space[5]};
  font-weight: bold;
`;

export const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [previousSearchTerms, setPreviousSearchTerms] = useState([]);
  const {
    isLoading,
    error,
    restaurants: allRestaurants,
  } = useContext(RestaurantsContext);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Update previousSearchTerms when the component is focused
      if (searchQuery !== "" && !previousSearchTerms.includes(searchQuery)) {
        setPreviousSearchTerms([searchQuery, ...previousSearchTerms]);
      }
    });

    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [navigation, previousSearchTerms, searchQuery]);

  const searchRestaurants = () => {
    const filteredRestaurants = allRestaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (searchQuery !== "" && filteredRestaurants.length === 0) {
      return [{ name: "No restaurants by that name" }];
    }

    return filteredRestaurants;
  };

  const handleSearch = () => {
    if (searchQuery !== "") {
      setPreviousSearchTerms([searchQuery, ...previousSearchTerms]);
    }
  };

  return (
    <TabLink>
      <SearchContainer>
        <Searchbar
          placeholder="search restaurants"
          value={searchQuery}
          onChangeText={(query) => setSearchQuery(query)}
          onSubmitEditing={handleSearch}
        />
      </SearchContainer>
      {previousSearchTerms.length > 0 && searchQuery === "" ? (
        // Show the "Previous searches" list only when the search bar is empty
        <View>
          <Spacer position="top" size="medium">
            <CenterText variant="label">Previous searches</CenterText>
          </Spacer>
          <FlatList
            data={previousSearchTerms}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSearchQuery(item)}>
                <Spacer position="top" size="medium">
                  <Spacer position="left" size="large">
                    <Text style={{ color: colors.brand.primary }}>{item}</Text>
                  </Spacer>
                </Spacer>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
      {searchQuery === "" && previousSearchTerms.length === 0 ? (
        // No previous search and no current search query
        <CenterView>
          <Text variant="label">No previous searches available</Text>
        </CenterView>
      ) : (
        // Render restaurant cards for valid search results
        <FlatList
          data={searchQuery === "" ? [] : searchRestaurants()}
          keyExtractor={(item, index) => item.name + index.toString()}
          renderItem={({ item }) =>
            item.name === "No restaurants by that name" ? (
              // Render "No restaurants by that name" message
              <CenterView>
                <Spacer position="bottom" size="large">
                  <Text variant="error">{item.name}</Text>
                </Spacer>
              </CenterView>
            ) : (
              // Render restaurant card for valid search results
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
            )
          }
        />
      )}
    </TabLink>
  );
};
