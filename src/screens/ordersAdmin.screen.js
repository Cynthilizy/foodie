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
import { Spacer } from "../styles/spacer.styles";
import { AuthenticationContextAdmin } from "../context/authenticationAdmin.context";
import { TabLink } from "../stylings/restaurant-info.styles";

const SearchBar = styled(TextInput)`
  height: 40px;
  margin: 12px;
  padding: 8px;
  border: 1px solid grey;
  border-radius: 10px;
`;

export const OrdersAdminScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { orders } = useContext(AuthenticationContextAdmin);

  const showDialog = (order) => {
    setSelectedOrder(order);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const validOrders = orders || [];
  const filteredOrders = validOrders.filter((order) =>
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TabLink>
      <SearchBar
        placeholder="Search by customer name..."
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
      />
      <ScrollView>
        {filteredOrders.map((order, index) => (
          <List.Item
            key={index}
            title={order.customerName}
            description={`Order ID: ${order.orderId}, Address: ${order.customerAddress}`}
            left={(props) => <Avatar.Icon {...props} icon="folder" />}
            onPress={() => showDialog(order)}
          />
        ))}
      </ScrollView>
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
