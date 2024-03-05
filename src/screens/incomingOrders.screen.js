import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView, TextInput } from "react-native";
import {
  List,
  Avatar,
  Dialog,
  Portal,
  Button,
  Paragraph,
} from "react-native-paper";
import styled from "styled-components/native";
import { Text } from "../styles/text.styles";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { TabLink } from "../stylings/restaurant-info.styles";
import { acceptOrder, rejectOrder } from "../service/firestore.service";
import { Audio } from "expo-av";

export const IncomingOrdersScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sound, setSound] = useState(null);

  const { incomingOrders, setIncomingOrders } = useContext(
    AuthenticationContextAdmin
  );

  const showDialog = (order) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const playSound = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../../assets/ping-ping.wav"),
        { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);
    } else {
      await sound.playAsync();
    }
  };

  const stopSound = () => {
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
  };

  useEffect(() => {
    if (incomingOrders.length > 0) {
      playSound();
    } else {
      stopSound();
    }
  }, [incomingOrders]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const handleAcceptOrder = async (order, index) => {
    stopSound();
    const success = await acceptOrder(order.orderId);
    if (success) {
      setIncomingOrders((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    } else {
      console.log("Error handling accept");
    }
  };

  const handleRejectOrder = async (order, index) => {
    stopSound();
    const success = await rejectOrder(order.orderId);
    if (success) {
      setIncomingOrders((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    } else {
      console.log("error handeling reject");
    }
  };

  const EmptyCartComponent = () => (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Avatar.Icon size={64} icon="cart-off" />
      <Text>No new orders yet</Text>
    </View>
  );

  return (
    <TabLink style={{ flex: 1 }}>
      {incomingOrders.length === 0 ? (
        <EmptyCartComponent />
      ) : (
        <ScrollView>
          {incomingOrders.map((order, index) => (
            <List.Item
              key={order.orderId}
              title={order.customerName}
              description={`Order ID: ${order.orderId}, Address: ${order.customerAddress}`}
              left={(props) => <Avatar.Icon {...props} icon="folder" />}
              right={(props) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Button onPress={() => handleAcceptOrder(order, index)}>
                    Accept
                  </Button>
                  <Button onPress={() => handleRejectOrder(order, index)}>
                    Reject
                  </Button>
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
