import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import {
  List,
  Avatar,
  Dialog,
  Portal,
  Button,
  Paragraph,
  Divider,
  Modal,
} from "react-native-paper";
import styled from "styled-components/native";
import { Text } from "../styles/text.styles";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import { TabLink } from "../stylings/restaurant-info.styles";
import { updateEarnings } from "../service/firestore.service";

export const EarningsScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { deliveredOrders } = useContext(AuthenticationContextAdmin);
  const { rider } = useContext(AuthenticationContextRider);

  const isInMonth = (timestamp, offset) => {
    const orderDate = new Date(timestamp.seconds * 1000);
    const currentDate = new Date();
    const targetMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() - offset)
    );
    return (
      orderDate.getMonth() === targetMonth.getMonth() &&
      orderDate.getFullYear() === targetMonth.getFullYear()
    );
  };

  const getMonthName = (date) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[date.getMonth()];
  };

  const ShowThreeMonthEarnings = () => {
    let earningsMessage = "";

    for (let i = 1; i <= 3; i++) {
      const monthlyOrders = deliveredOrders.filter(
        (order) =>
          order.riderId === rider.phoneRider && isInMonth(order.timestamp, i)
      );
      const monthlyEarnings = monthlyOrders
        .reduce((acc, order) => acc + parseFloat(order.deliveryFee), 0)
        .toFixed(2);

      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() - i);
      const monthName = getMonthName(targetDate);

      earningsMessage += `${monthName}: ₦${monthlyEarnings}\n`;
    }
    return (
      <Modal
        visible={showModal}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.header}>Earnings</Text>
        <Text style={styles.message}>{earningsMessage}</Text>
        <Button mode="contained" onPress={() => setShowModal(false)}>
          Close
        </Button>
      </Modal>
    );
  };

  const relevantOrders = deliveredOrders.filter(
    (order) =>
      order.riderId === rider.phoneRider && isInMonth(order.timestamp, 0)
  );

  const calculateMonthlyEarnings = () => {
    const monthlyEarnings = relevantOrders
      .reduce((acc, order) => acc + parseFloat(order.deliveryFee), 0)
      .toFixed(2);
    updateEarnings(rider.phoneRider, monthlyEarnings);
    return monthlyEarnings;
  };

  const showDialog = (order) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const EmptyCartComponent = () => (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Avatar.Icon size={64} icon="cart-off" />
      <Text>No Earnings For This Month Yet</Text>
    </View>
  );

  return (
    <TabLink style={{ flex: 1 }}>
      <View style={styles.circleContainer}>
        <View style={styles.earningsCircle}>
          <Text style={styles.earningsText}>₦{calculateMonthlyEarnings()}</Text>
          <Text style={styles.earningsLabel}>Earnings This Month</Text>
        </View>
      </View>
      {relevantOrders.length === 0 ? (
        <EmptyCartComponent />
      ) : (
        <ScrollView>
          {relevantOrders.map((order, index, arr) => (
            <React.Fragment key={order.orderId}>
              <List.Item
                title={order.orderId}
                left={(props) => <Avatar.Icon {...props} icon="folder" />}
                onPress={() => showDialog(order)}
              />
              {index !== arr.length - 1 && <Divider />}
            </React.Fragment>
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
                  <Paragraph style={styles.label}>🆔 Order ID: </Paragraph>
                  <Paragraph>{selectedOrder.orderId}</Paragraph>
                </View>
                <View style={styles.itemRow}>
                  <Paragraph style={styles.label}>✅ Amount Earned: </Paragraph>
                  <Paragraph>₦{selectedOrder.deliveryFee}</Paragraph>
                </View>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Button mode="contained" onPress={() => setShowModal(true)}>
        Show Previous Earnings
      </Button>
      {showModal && ShowThreeMonthEarnings()}
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
  circleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  earningsCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  earningsText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  earningsLabel: {
    fontSize: 18,
    marginTop: 10,
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
});
