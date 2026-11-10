// Imports React and components for displaying and managing orders
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useStatusGroups } from "../hooks/useStatusGroups";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Orders Management screen
import type { OrdersManagementScreenProps } from "../types/types";

// Displays customer orders and allows the client to update order statuses
export const OrdersManagementScreen = ({
  Header,
  BusinessBackButton,
  adminOrders,
  markOrderAsFilled,
  markOrderAsPaid,
  markOrderAsOpen,
  markOrderAsCancelled,
}: OrdersManagementScreenProps) => {
  // Manages expandable order status groups
  const { expandedGroups, toggleGroup } = useStatusGroups(["Open"]);
  return (
    <>
      <Header title="Incoming Orders" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Returns to the business administration screen */}
        <BusinessBackButton />

        {/* Displays an empty message when there are no orders */}
        {adminOrders.length === 0 ? (
          <Text style={styles.cardSubtitle}>No customer orders found.</Text>
        ) : (
          // Groups customer orders by their current status
          ["Pending Payment", "Open", "Filled", "Cancelled"].map((status) => {
            // Finds requests belonging to the current status group
            const groupOrders = adminOrders.filter(
              (order) => order.status === status,
            );

            const isExpanded = expandedGroups.includes(status);

            return (
              <View key={status}>
                {/* Displays the expandable status group heading */}
                <Pressable
                  style={styles.card}
                  onPress={() => toggleGroup(status)}
                >
                  <Text style={styles.cardTitle}>
                    {status} Orders ({groupOrders.length}){" "}
                    {isExpanded ? "▲" : "▼"}
                  </Text>
                </Pressable>

                {/* Displays requests only when the group is expanded */}
                {isExpanded &&
                  groupOrders.map((order) => (
                    <View key={order.id} style={styles.card}>
                      {/* Displays order identification and customer information */}
                      <Text style={styles.orderNumberTitle}>
                        Order #{order.id.slice(0, 8)}
                      </Text>

                      <Text style={styles.cardSubtitle}>
                        Customer: {order.customerName}
                      </Text>

                      <Text style={styles.cardSubtitle}>
                        Status: {order.status}
                      </Text>

                      <Text style={styles.cardSubtitle}>
                        Payment Status: {order.paymentStatus}
                      </Text>

                      {/* Displays the selected payment method for every order status */}
                      <Text style={styles.cardSubtitle}>
                        Payment Method: {order.paymentMethod}
                      </Text>

                      {/* Shows the amount the client needs to verify before marking the order as paid */}
                      {order.status === "Pending Payment" && (
                        <Text style={styles.cardSubtitle}>
                          Amount Due: ${Number(order.total).toFixed(2)}
                        </Text>
                      )}

                      {/* Displays the items and quantities in the order */}
                      <Text style={styles.orderedItemsTitle}>
                        Ordered Items:
                      </Text>

                      {order.items?.map((item: any, index: number) => (
                        <Text key={index} style={styles.cardSubtitle}>
                          {item.name} - Quantity: {item.quantity}
                        </Text>
                      ))}

                      {/* Allows the client to confirm payment for an electronic order */}
                      {order.status === "Pending Payment" && (
                        <Pressable
                          style={styles.adminButton}
                          onPress={() => markOrderAsPaid(order.id)}
                        >
                          <Text style={styles.adminButtonText}>
                            Mark as Paid
                          </Text>
                        </Pressable>
                      )}

                      {/* Allows the client to mark an order as filled */}
                      {order.status !== "Filled" &&
                        order.status !== "Pending Payment" && (
                          <Pressable
                            style={styles.adminButton}
                            onPress={() => markOrderAsFilled(order.id)}
                          >
                            <Text style={styles.adminButtonText}>
                              Mark as Filled
                            </Text>
                          </Pressable>
                        )}

                      {/* Allows the client to reopen an order */}
                      {order.status !== "Open" &&
                        order.status !== "Pending Payment" && (
                          <Pressable
                            style={styles.adminButton}
                            onPress={() => markOrderAsOpen(order.id)}
                          >
                            <Text style={styles.adminButtonText}>
                              Mark as Open
                            </Text>
                          </Pressable>
                        )}

                      {/* Allows the client to cancel an order */}
                      {order.status !== "Cancelled" &&
                        order.status !== "Pending Payment" && (
                          <Pressable
                            style={styles.adminButton}
                            onPress={() => markOrderAsCancelled(order.id)}
                          >
                            <Text style={styles.adminButtonText}>
                              Mark as Cancelled
                            </Text>
                          </Pressable>
                        )}
                    </View>
                  ))}
                {/* Displays a message when an expanded group is empty */}
                {isExpanded && groupOrders.length === 0 && (
                  <View style={styles.card}>
                    <Text style={styles.cardSubtitle}>
                      No {status.toLowerCase()} orders.
                    </Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </>
  );
};
