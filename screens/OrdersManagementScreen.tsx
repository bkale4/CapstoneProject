// Imports React and components for displaying and managing orders
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Orders Management screen
import type { OrdersManagementScreenProps } from "../types";

// Displays customer orders and allows the client to update order statuses
export const OrdersManagementScreen = ({
  Header,
  BusinessBackButton,
  adminOrders,
  markOrderAsFilled,
  markOrderAsOpen,
  markOrderAsCancelled,
}: OrdersManagementScreenProps) => (
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
        ["Open", "Filled", "Cancelled"].map((status) => (
          <View key={status}>
            <Text style={styles.menuSectionTitle}>{status} Orders</Text>

            {/* Displays all orders matching the selected status */}
            {adminOrders
              .filter((order: any) => order.status === status)
              .map((order: any) => (
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

                  {/* Displays the items and quantities in the order */}
                  <Text style={styles.orderedItemsTitle}>Ordered Items:</Text>

                  {order.items?.map((item: any, index: number) => (
                    <Text key={index} style={styles.cardSubtitle}>
                      {item.name} - Quantity: {item.quantity}
                    </Text>
                  ))}

                  {/* Allows the client to mark an order as filled */}
                  {order.status !== "Filled" && (
                    <Pressable
                      style={styles.adminButton}
                      onPress={() => markOrderAsFilled(order.id)}
                    >
                      <Text style={styles.adminButtonText}>Mark as Filled</Text>
                    </Pressable>
                  )}

                  {/* Allows the client to reopen an order */}
                  {order.status !== "Open" && (
                    <Pressable
                      style={styles.adminButton}
                      onPress={() => markOrderAsOpen(order.id)}
                    >
                      <Text style={styles.adminButtonText}>Mark as Open</Text>
                    </Pressable>
                  )}

                  {/* Allows the client to cancel an order */}
                  {order.status !== "Cancelled" && (
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
          </View>
        ))
      )}
    </ScrollView>
  </>
);
