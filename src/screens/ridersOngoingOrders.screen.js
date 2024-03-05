import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import {
  List,
  Avatar,
  Dialog,
  Portal,
  Button,
  Paragraph,
} from "react-native-paper";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native-paper";
import { Text } from "../styles/text.styles";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import { TabLink } from "../stylings/restaurant-info.styles";
import {
  addDeliveredMeal,
  removeOrderRider,
  deliveredMeal,
} from "../service/firestore.service";
import { startOrderRider } from "../service/firestore.service";
import { convertAddToLatLng } from "../service/checkout.service";
import * as Location from "expo-location";

export const OngoingOrdersRiders = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startedOrders, setStartedOrders] = useState(new Set());
  const [isStartingOrder, setIsStartingOrder] = useState(false);
  const [isDeliveringMeal, setIsDeliveringMeal] = useState(false);

  const { acceptedOrders, setAcceptedOrders } = useContext(
    AuthenticationContextAdmin
  );
  const { rider } = useContext(AuthenticationContextRider);

  const showDialog = (order) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  async function getCurrentLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return null;
      }
      let location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  }

  const openInGoogleMaps = async (
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude
  ) => {
    let url;
    if (Platform.OS === "android") {
      url = `google.navigation:q=${endLatitude},${endLongitude}&mode=d`;
    } else {
      url = `comgooglemaps://?saddr=${startLatitude},${startLongitude}&daddr=${endLatitude},${endLongitude}&directionsmode=driving`;
    }

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    } else {
      console.log("Can't handle app URL, opening in browser...");
      Linking.openURL(
        `https://www.google.com/maps/dir/${startLatitude},${startLongitude}/${endLatitude},${endLongitude}?travelmode=driving`
      );
    }
  };

  const handleStartOrder = async (order, index) => {
    try {
      setIsStartingOrder(true);
      await startOrderRider(order.orderId);
      const coords = await convertAddToLatLng(order.customerAddress);
      if (coords && coords.lat && coords.lng) {
        const currentLocation = await getCurrentLocation();
        if (currentLocation) {
          openInGoogleMaps(
            currentLocation.latitude,
            currentLocation.longitude,
            coords.lat,
            coords.lng
          );
        } else {
          console.error("Failed to get current location.");
        }
      } else {
        console.error("Failed to get valid coordinates from address.");
      }
      setStartedOrders((prev) => new Set([...prev, order.orderId]));
    } catch (error) {
      console.error("Error when trying to start order:", error);
    } finally {
      setIsStartingOrder(false);
    }
  };

  const handleRemoveOrder = async (order, index) => {
    await removeOrderRider(order.orderId);
    const orderArray = [...acceptedOrders];
    const updatedArray = orderArray.filter((o) => o.orderId !== order.orderId);
    const updatedSet = new Set(updatedArray);
    setAcceptedOrders(updatedSet);
  };

  const EmptyCartComponent = () => (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Avatar.Icon size={64} icon="cart-off" />
      <Text>No Accepted orders yet</Text>
    </View>
  );

  const handleMealDelivered = async (order, index) => {
    try {
      setIsDeliveringMeal(true);
      await deliveredMeal(order.orderId);
      await addDeliveredMeal(
        order.orderId,
        rider.phoneRider,
        order.deliveryFee
      );
      const updatedAcceptedOrders = [...acceptedOrders];
      updatedAcceptedOrders.splice(index, 1);
      setAcceptedOrders(new Set(updatedAcceptedOrders));
    } catch (error) {
      console.error("Error when marking meal as delivered:", error);
    } finally {
      setIsDeliveringMeal(false);
    }
  };

  return (
    <TabLink style={{ flex: 1 }}>
      {[...acceptedOrders].length === 0 ? (
        <EmptyCartComponent />
      ) : (
        <ScrollView>
          {[...acceptedOrders].map((order, index) => (
            <List.Item
              key={order.orderId}
              title={order.customerName}
              description={() => (
                <View>
                  <Text variant="caption">Order ID: {order.orderId}</Text>
                  <Text variant="caption">
                    Address: {order.customerAddress}
                  </Text>
                  <Text variant="caption">
                    Delivery Fee: {`₦${order.deliveryFee}`}
                  </Text>
                </View>
              )}
              left={(props) => <Avatar.Icon {...props} icon="folder" />}
              right={(props) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {startedOrders.has(order.orderId) ? (
                    <Button
                      onPress={() => {
                        handleMealDelivered(order, index);
                      }}
                      disabled={isDeliveringMeal}
                    >
                      {isDeliveringMeal ? (
                        <ActivityIndicator size="small" color="black" />
                      ) : (
                        "Meal Delivered"
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onPress={() => handleStartOrder(order, index)}
                        disabled={isStartingOrder}
                      >
                        {isStartingOrder ? (
                          <ActivityIndicator size="small" color="black" />
                        ) : (
                          "Start"
                        )}
                      </Button>
                      <Button onPress={() => handleRemoveOrder(order, index)}>
                        Remove
                      </Button>
                    </>
                  )}
                </View>
              )}
              onPress={() => showDialog(order)}
            />
          ))}
        </ScrollView>
      )}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title style={{ textAlign: "center" }}>
            Order Details
          </Dialog.Title>
          <Dialog.Content>
            {selectedOrder && (
              <>
                <View style={styles.itemRow}>
                  <Paragraph style={styles.label}>👤 Customer Name: </Paragraph>
                  <Paragraph>{selectedOrder.customerName}</Paragraph>
                </View>
                <View style={styles.itemRow}>
                  <Paragraph style={styles.label}>🆔 Order ID: </Paragraph>
                  <Paragraph>{selectedOrder.orderId}</Paragraph>
                </View>
                <View style={styles.itemRow}>
                  <Paragraph style={styles.label}>📞 Phone: </Paragraph>
                  <Paragraph>{selectedOrder.customerPhone}</Paragraph>
                </View>
                <View>
                  <Paragraph style={styles.label}>
                    📍 Delivery Address:
                  </Paragraph>
                  <Paragraph>{selectedOrder.customerAddress}</Paragraph>
                </View>
                <View style={styles.itemRow}>
                  <Paragraph style={styles.label}>
                    🍴 Chosen Restaurant:
                  </Paragraph>
                  <Paragraph>{selectedOrder.restaurant.name}</Paragraph>
                </View>
                <View style={styles.itemRow}>
                  <Paragraph style={styles.label}>✅ Order Status: </Paragraph>
                  <Paragraph> {selectedOrder.orderStatus}</Paragraph>
                </View>
                <Paragraph
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingTop: 4,
                  }}
                >
                  Order Items
                </Paragraph>
                {selectedOrder.orderList.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Paragraph style={styles.label}>
                      🛒 {item.product}: {item.quantity}
                    </Paragraph>
                  </View>
                ))}
                <View style={styles.itemRow}>
                  <Paragraph style={styles.label}>KITCHEN STATUS: </Paragraph>
                  <Paragraph>{selectedOrder.kitchenStatus}</Paragraph>
                </View>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </TabLink>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemRow: {
    flexDirection: "row",
    paddingBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
});
