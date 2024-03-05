import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, Button, StyleSheet } from "react-native";
import { List, Avatar, Dialog, Portal, Paragraph } from "react-native-paper";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../service/firebase.service";
import { colors } from "../styles/colors.styles";
import { TabLink } from "../stylings/restaurant-info.styles";
import { fetchDeliveredOrders } from "../service/firestore.service";
import { Text } from "../styles/text.styles";

export const OngoingOrders = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { ongoingOrders, setOngoingOrders } = useContext(
    AuthenticationContextAdmin
  );

  const showDialog = (order) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const updateStage = async (orderId, stage) => {
    try {
      const orderDocRef = doc(db, "purchases", orderId);
      await updateDoc(orderDocRef, {
        kitchenStatus: stage,
      });
      return true;
    } catch (error) {
      console.error(`Error updating order ${orderId}:`, error);
      return false;
    }
  };

  const handleNextStage = async (order, index) => {
    const stages = [
      "Accepted",
      "Cooking",
      "Ready",
      "RiderAccepts",
      "PickedUp",
      "Delivered",
    ];
    const currentIndex = stages.indexOf(order.kitchenStatus);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      if (await updateStage(order.orderId, nextStage)) {
        order.kitchenStatus = nextStage;
        setOngoingOrders([...ongoingOrders]);
      }
    }
  };

  const handlePreviousStage = async (order, index) => {
    const stages = [
      "Accepted",
      "Cooking",
      "Ready",
      "RiderAccepts",
      "PickedUp",
      "Delivered",
    ];
    const currentIndex = stages.indexOf(order.kitchenStatus);
    if (currentIndex > 0) {
      const previousStage = stages[currentIndex - 1];
      if (await updateStage(order.orderId, previousStage)) {
        order.kitchenStatus = previousStage;
        setOngoingOrders([...ongoingOrders]);
      }
    }
  };

  const ProgressBarWithCircles = ({ currentStage }) => {
    const stages = [
      "Accepted",
      "Cooking",
      "Ready",
      "RiderAccepts",
      "PickedUp",
      "Delivered",
    ];
    const currentIndex = stages.indexOf(currentStage);
    return (
      <View style={styles.progressBar}>
        {stages.map((stage, index) => (
          <View key={stage} style={styles.circleContainer}>
            <View
              style={[
                styles.circle,
                currentIndex >= index ? styles.activeCircle : {},
              ]}
            />
            <Paragraph style={styles.stageText}>{stage}</Paragraph>
          </View>
        ))}
      </View>
    );
  };

  const Divider = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: "grey", marginVertical: 10 }}
      />
    );
  };

  /*useEffect(() => {
    let isMounted = true; // To prevent setting state on an unmounted component
    const checkAndRemoveDelivered = async () => {
      const deliveredOrders = await fetchDeliveredOrders();
      const deliveredOrderIds = deliveredOrders.map((order) => order.orderId);
      if (isMounted) {
        setOngoingOrders((prevOngoingOrders) => {
          return prevOngoingOrders.filter(
            (order) => !deliveredOrderIds.includes(order.orderId)
          );
        });
      }
    };
    const intervalId = setInterval(checkAndRemoveDelivered, 10000);
    return () => {
      isMounted = false;
      clearInterval(intervalId); // Cleanup: clear the interval when component unmounts
    };
  }, []);*/

  const EmptyCartComponent = () => (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Avatar.Icon size={64} icon="cart-off" />
      <Text>No Ongoing Orders</Text>
    </View>
  );

  return (
    <TabLink style={{ flex: 1 }}>
      {ongoingOrders.length === 0 ? (
        <EmptyCartComponent />
      ) : (
        <ScrollView>
          {ongoingOrders.map((order, index) => (
            <View key={order.orderId}>
              <List.Item
                title={order.customerName}
                description={`Order ID: ${order.orderId}, Address: ${order.customerAddress}`}
                left={(props) => <Avatar.Icon {...props} icon="folder" />}
                onPress={() => showDialog(order)}
              />
              <Paragraph style={{ paddingLeft: 10, paddingTop: 5 }}>
                Current Stage: {order.kitchenStatus}
              </Paragraph>
              <ProgressBarWithCircles currentStage={order.kitchenStatus} />
              <View style={styles.buttonContainer}>
                <Button
                  title="Previous"
                  disabled={order.kitchenStatus === "Accepted"}
                  onPress={() => handlePreviousStage(order, index)}
                />
                <Button
                  title="Next"
                  disabled={
                    order.kitchenStatus === "Ready" ||
                    order.kitchenStatus === "RiderAccepts" ||
                    order.kitchenStatus === "PickedUp" ||
                    order.kitchenStatus === "Delivered"
                  }
                  onPress={() => handleNextStage(order, index)}
                />
              </View>
              <Divider />
            </View>
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
            <Button title="Done" onPress={hideDialog} />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </TabLink>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  circleContainer: {
    alignItems: "center",
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.brand.muted,
    marginBottom: 4,
  },
  activeCircle: {
    backgroundColor: colors.text.success,
    borderColor: colors.text.success,
  },
  stageText: {
    fontSize: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
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
