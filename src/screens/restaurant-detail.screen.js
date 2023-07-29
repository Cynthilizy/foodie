import React, { useState } from "react";
import { ScrollView } from "react-native";
import { List, Divider } from "react-native-paper";
import { TabLink } from "../stylings/restaurant-info.styles";
import { Text } from "../styles/text.styles";
import { RestaurantInfo } from "../features/restaurant-info";
import { Spacer } from "../styles/spacer.styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { foodPhotos } from "../foodPhotos";
import { Image } from "react-native";
import { OrderButton } from "../stylings/restaurant-list.styles";

export const NairaIcon = () => {
  return <Icon name="currency-ngn" color="white" size={18} />;
};

export const RestaurantDetailScreen = ({ route }) => {
  const [riceExpanded, setriceExpanded] = useState(false);
  const [swallowExpanded, setswallowExpanded] = useState(false);
  const [proteinExpanded, setproteinExpanded] = useState(false);
  const [sideExpanded, setSideExpanded] = useState(false);
  const [drinksExpanded, setDrinksExpanded] = useState(false);
  const [specialExpanded, setSpecialExpanded] = useState(false);

  const { restaurant } = route.params;
  const { addToCart } = useContext(CartContext);

  const CustomListItem = ({ title, imageSource, price }) => {
    return (
      <List.Item
        title={title}
        right={() => (
          <>
            <Image source={imageSource} style={{ width: 100, height: 100 }} />
            <OrderButton
              icon={NairaIcon}
              mode="contained"
              onPress={() => {
                addToCart({ item: title, price: price }, restaurant);
              }}
            >
              Add to Cart
            </OrderButton>
          </>
        )}
      />
    );
  };

  return (
    <TabLink>
      <RestaurantInfo restaurant={restaurant} />
      <ScrollView>
        <List.Accordion
          title="Rice Meals"
          left={(props) => <List.Icon {...props} />}
          expanded={riceExpanded}
          onPress={() => setriceExpanded(!riceExpanded)}
        >
          <CustomListItem
            title="Jollof Rice"
            imageSource={foodPhotos.jollofRice}
            price={25000}
          />
          <Divider />
          <CustomListItem
            title="Fried Rice"
            imageSource={foodPhotos.friedRice}
            price={25000}
          />
          <Divider />
          <CustomListItem
            title="Steamed Rice"
            imageSource={foodPhotos.steamedRice}
            price={20000}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Swallow"
          left={(props) => <List.Icon {...props} />}
          expanded={swallowExpanded}
          onPress={() => setswallowExpanded(!swallowExpanded)}
        >
          <CustomListItem
            title="Amala"
            imageSource={foodPhotos.amala}
            price={20000}
          />
          <Divider />
          <CustomListItem
            title="Eba"
            imageSource={foodPhotos.eba}
            price={20000}
          />
          <Divider />
          <CustomListItem
            title="Fufu"
            imageSource={foodPhotos.fufu}
            price={20000}
          />
          <Divider />
          <CustomListItem
            title="Pounded Yam"
            imageSource={foodPhotos.poundedYam}
            price={20000}
          />
          <Divider />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Protein"
          left={(props) => <List.Icon {...props} />}
          expanded={proteinExpanded}
          onPress={() => setproteinExpanded(!proteinExpanded)}
        >
          <CustomListItem
            title="Chicken"
            imageSource={foodPhotos.chicken}
            price={70000}
          />
          <Divider />
          <CustomListItem
            title="Mackrel Fish (Titus)"
            imageSource={foodPhotos.mackrel}
            price={50000}
          />
          <Divider />
          <CustomListItem
            title="Tilapia Fish"
            imageSource={foodPhotos.tilapia}
            price={70000}
          />
          <Divider />
          <CustomListItem title="Turkey" imageSource={foodPhotos.turkey} />
          <Divider />
          <CustomListItem
            title="Assorted Meat"
            imageSource={foodPhotos.assorted}
            price={100000}
          />
          <Divider />
          <CustomListItem
            title="Cow Skin (Pkomo)"
            imageSource={foodPhotos.pkomo}
            price={20000}
          />
          <Divider />
          <CustomListItem
            title="Beef"
            imageSource={foodPhotos.beef}
            price={20000}
          />
          <Divider />
          <CustomListItem
            title="Peppered Snail"
            imageSource={foodPhotos.snail}
            price={50000}
          />
          <Divider />
          <CustomListItem
            title="Boiled Eggs"
            imageSource={foodPhotos.boiledEggs}
            price={15000}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Sides"
          left={(props) => <List.Icon {...props} />}
          expanded={sideExpanded}
          onPress={() => setSideExpanded(!sideExpanded)}
        >
          <CustomListItem
            title="Plantain"
            imageSource={foodPhotos.plantain}
            price={30000}
          />
          <Divider />
          <CustomListItem
            title="Moi-Moi"
            imageSource={foodPhotos.moimoi}
            price={30000}
          />
          <Divider />
          <CustomListItem
            title="Salad (Coleslaw)"
            imageSource={foodPhotos.salad}
            price={30000}
          />
          <Divider />
          <CustomListItem
            title="Spaghetti"
            imageSource={foodPhotos.spaghetti}
            price={20000}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Drinks"
          left={(props) => <List.Icon {...props} />}
          expanded={drinksExpanded}
          onPress={() => setDrinksExpanded(!drinksExpanded)}
        >
          <CustomListItem
            title="Water"
            imageSource={foodPhotos.water}
            price={200}
          />
          <Divider />
          <CustomListItem
            title="Coke"
            imageSource={foodPhotos.softDrinks}
            price={25000}
          />
          <Divider />
          <CustomListItem
            title="Fanta"
            imageSource={foodPhotos.softDrinks}
            price={25000}
          />
          <Divider />
          <CustomListItem
            title="Sprite"
            imageSource={foodPhotos.softDrinks}
            price={25000}
          />
          <Divider />
          <CustomListItem
            title="Orange Juice"
            imageSource={foodPhotos.orangeJuice}
            price={50000}
          />
          <Divider />
          <CustomListItem
            title="Ice Tea"
            imageSource={foodPhotos.iceTea}
            price={50000}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Special Plates"
          left={(props) => <List.Icon {...props} />}
          expanded={specialExpanded}
          onPress={() => setSpecialExpanded(!specialExpanded)}
        >
          <CustomListItem title="Jollof Rice Special" price={170000}>
            <Text variant="hint">
              includes:jollof rice, plantain, chicken, coleslaw, coke
            </Text>
          </CustomListItem>
          <Divider />
          <CustomListItem title="Steamed Rice Special" price={170000}>
            <Text variant="hint">
              includes:steamed rice, plantain, turkey, coleslaw, coke
            </Text>
          </CustomListItem>
          <Divider />
          <CustomListItem title="Pounded Yam Special" price={150000}>
            <Text variant="hint">
              includes:pounded Yam, melon soup(egusi), cow Skin(pkomo) , beef,
              Mackrel Fish(Titus)
            </Text>
          </CustomListItem>
          <Divider />
          <CustomListItem title="Eba Special" price={150000}>
            <Text variant="hint">
              includes:eba, vegetable soup, assorted meat, Mackrel Fish(Titus),
              cow Skin(Pkomo)
            </Text>
          </CustomListItem>
          <Divider />
        </List.Accordion>
      </ScrollView>
      <Spacer position="bottom" size="large">
        <OrderButton
          icon={EuroIcon}
          mode="contained"
          onPress={() => {
            navigation.navigate("Checkout");
          }}
        >
          Go To Cart
        </OrderButton>
      </Spacer>
    </TabLink>
  );
};
