import React, { useState } from "react";
import { ScrollView } from "react-native";
import { List, Divider } from "react-native-paper";
import { TabLink } from "../stylings/restaurant-info.styles";
import { RestaurantInfo } from "../features/restaurant-info";
import { Spacer } from "../styles/spacer.styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { foodPhotos } from "../foodPhotos";
import { Image } from "react-native";

export const EuroIcon = () => {
  return <Icon name="euro" color="white" size={18} />;
};

const CustomListItem = ({ title, imageSource }) => {
  return (
    <List.Item
      title={title}
      right={() => (
        <Image source={imageSource} style={{ width: 100, height: 100 }} />
      )}
    />
  );
};

export const RestaurantDetailScreen = ({ route }) => {
  const [riceExpanded, setriceExpanded] = useState(false);
  const [swallowExpanded, setswallowExpanded] = useState(false);
  const [proteinExpanded, setproteinExpanded] = useState(false);
  const [sideExpanded, setSideExpanded] = useState(false);
  const [drinksExpanded, setDrinksExpanded] = useState(false);
  const [specialExpanded, setSpecialExpanded] = useState(false);

  const { restaurant } = route.params;

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
          />
          <Divider />
          <CustomListItem
            title="Fried Rice"
            imageSource={foodPhotos.friedRice}
          />
          <Divider />
          <CustomListItem
            title="Steamed Rice"
            imageSource={foodPhotos.steamedRice}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Swallow"
          left={(props) => <List.Icon {...props} />}
          expanded={swallowExpanded}
          onPress={() => setswallowExpanded(!swallowExpanded)}
        >
          <CustomListItem title="Amala" imageSource={foodPhotos.amala} />
          <Divider />
          <CustomListItem title="Eba" imageSource={foodPhotos.eba} />
          <Divider />
          <CustomListItem title="Fufu" imageSource={foodPhotos.fufu} />
          <Divider />
          <CustomListItem
            title="Pounded Yam"
            imageSource={foodPhotos.poundedYam}
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
          <CustomListItem title="Chicken" imageSource={foodPhotos.chicken} />
          <Divider />
          <CustomListItem
            title="Mackrel Fish (Titus)"
            imageSource={foodPhotos.mackrel}
          />
          <Divider />
          <CustomListItem
            title="Tilapia Fish"
            imageSource={foodPhotos.tilapia}
          />
          <Divider />
          <CustomListItem title="Turkey" imageSource={foodPhotos.turkey} />
          <Divider />
          <CustomListItem
            title="Assorted Meat"
            imageSource={foodPhotos.assorted}
          />
          <Divider />
          <CustomListItem
            title="Cow Skin (Pkomo)"
            imageSource={foodPhotos.pkomo}
          />
          <Divider />
          <CustomListItem title="Beef" imageSource={foodPhotos.beef} />
          <Divider />
          <CustomListItem
            title="Peppered Snail"
            imageSource={foodPhotos.snail}
          />
          <Divider />
          <CustomListItem
            title="Boiled Eggs"
            imageSource={foodPhotos.boiledEggs}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Sides"
          left={(props) => <List.Icon {...props} />}
          expanded={sideExpanded}
          onPress={() => setSideExpanded(!sideExpanded)}
        >
          <CustomListItem title="Plantain" imageSource={foodPhotos.plantain} />
          <Divider />
          <CustomListItem title="Moi-Moi" imageSource={foodPhotos.moimoi} />
          <Divider />
          <CustomListItem
            title="Salad (Coleslaw)"
            imageSource={foodPhotos.salad}
          />
          <Divider />
          <CustomListItem
            title="Spaghetti"
            imageSource={foodPhotos.spaghetti}
          />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Drinks"
          left={(props) => <List.Icon {...props} />}
          expanded={drinksExpanded}
          onPress={() => setDrinksExpanded(!drinksExpanded)}
        >
          <CustomListItem title="Coke" imageSource={foodPhotos.softDrinks} />
          <Divider />
          <CustomListItem title="Fanta" imageSource={foodPhotos.softDrinks} />
          <Divider />
          <CustomListItem title="Sprite" imageSource={foodPhotos.softDrinks} />
          <Divider />
          <CustomListItem
            title="Orange Juice"
            imageSource={foodPhotos.orangeJuice}
          />
          <Divider />
          <CustomListItem title="Ice Tea" imageSource={foodPhotos.iceTea} />
          <Divider />
          <CustomListItem title="Water" imageSource={foodPhotos.water} />
        </List.Accordion>

        <Divider />
        <List.Accordion
          title="Special Plates"
          left={(props) => <List.Icon {...props} />}
          expanded={specialExpanded}
          onPress={() => setSpecialExpanded(!specialExpanded)}
        >
          <CustomListItem title="Jollof Rice Special" />
          <Divider />
          <CustomListItem title="Steamed Rice Special" />
          <Divider />
          <CustomListItem title="Pounded Yam Special" />
          <Divider />
          <CustomListItem title="Eba Special" />
          <Divider />
        </List.Accordion>
      </ScrollView>
      <Spacer position="bottom" size="large"></Spacer>
    </TabLink>
  );
};
