import React, { useState, useContext } from "react";
import { FlatList, TouchableOpacity, View, ScrollView } from "react-native";
import { Searchbar, Button } from "react-native-paper";
import { styled } from "styled-components/native";
import { TabLink } from "../stylings/restaurant-info.styles";
import { RestaurantsContext } from "../context/restaurant.context";
import { RestaurantInfo } from "../features/restaurant-info";
import { Spacer } from "../styles/spacer.styles";
import { Text } from "../styles/text.styles";
import { colors } from "../styles/colors.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/EvilIcons";

const SearchContainer = styled.View`
  padding: ${(props) => props.theme.space[3]};
`;

const StripedContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) =>
    props.index % 2 === 0 ? colors.bg.secondary : colors.ui.disabled};
  padding: 8px 16px; /* Adjust padding for better spacing */
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

  const addToSearchHistory = async (term) => {
    if (!previousSearchTerms.includes(term)) {
      const updatedHistory = [term, ...previousSearchTerms];
      setPreviousSearchTerms(updatedHistory);

      try {
        await AsyncStorage.setItem(
          "searchHistory",
          JSON.stringify(updatedHistory)
        );
      } catch (error) {
        console.error("Error saving search history:", error);
      }
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const storedHistory = await AsyncStorage.getItem("searchHistory");
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setPreviousSearchTerms(parsedHistory);
      }
    });
    // Clean up the listener when the component is unmounted
    return unsubscribe;
  }, [navigation]);

  const searchRestaurants = () => {
    const filteredRestaurants = allRestaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (searchQuery !== "" && filteredRestaurants.length === 0) {
      return [{ name: "No restaurants by that name" }];
    }
    return filteredRestaurants;
  };

  const handleSearch = async () => {
    if (searchQuery !== "") {
      addToSearchHistory(searchQuery);
      const updatedHistory = [searchQuery, ...previousSearchTerms];
      setPreviousSearchTerms(updatedHistory);

      try {
        await AsyncStorage.setItem(
          "searchHistory",
          JSON.stringify(updatedHistory)
        );
      } catch (error) {
        console.error("Error saving search history:", error);
      }
    }
  };

  const handleClearHistory = async () => {
    try {
      await AsyncStorage.removeItem("searchHistory");
      setPreviousSearchTerms([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {previousSearchTerms.length > 0 && searchQuery === "" ? (
          // Show the "Previous searches" list only when the search bar is empty
          <View>
            <Spacer position="top" size="medium">
              <CenterText variant="label">Previous searches</CenterText>
            </Spacer>
            {previousSearchTerms.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSearchQuery(item)}
              >
                <StripedContainer index={index}>
                  <Icon
                    name="search"
                    size={20}
                    color={colors.brand.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{ color: colors.brand.primary }}>{item}</Text>
                </StripedContainer>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </ScrollView>
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
                onPress={() => {
                  if (searchQuery !== "") {
                    addToSearchHistory(searchQuery); // Add the original search query to history
                  }
                  setSearchQuery(item.name);
                  navigation.navigate("RestaurantDetail", {
                    restaurant: item,
                  });
                }}
              >
                <Spacer position="bottom" size="large">
                  <RestaurantInfo restaurant={item} />
                </Spacer>
              </TouchableOpacity>
            )
          }
        />
      )}

      {previousSearchTerms.length > 0 && searchQuery === "" && (
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Button mode="contained" onPress={handleClearHistory}>
            Clear Search History
          </Button>
        </View>
      )}
    </TabLink>
  );
};
