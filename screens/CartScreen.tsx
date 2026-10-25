// Imports React and the components used to display and manage the cart
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Cart screen
import type { CartScreenProps } from "../types";

// Displays cart items, quantites, prices, and checkout options
export const CartScreen = ({
  Header,
  cartItems,
  cartTotal,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  clearCart,
  setScreen,
}: CartScreenProps) => (
  <>
    <Header title="Cart / Order Review" />
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Your Order</Text>

        {cartItems.length === 0 ? (
          <Text style={styles.summaryLine}>Your cart is empty.</Text>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartItemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.summaryLine}>
                  ${item.price.toFixed(2)} each
                </Text>
                <Text style={styles.summaryLine}>
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>

              <View style={styles.quantityControls}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(item.id)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => increaseQuantity(item.id)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </Pressable>
            </View>
          ))
        )}

        <Text style={styles.summaryTotal}>Total: ${cartTotal.toFixed(2)}</Text>
      </View>

      <Pressable style={styles.secondaryButton} onPress={clearCart}>
        <Text style={styles.secondaryButtonText}>Clear Cart</Text>
      </Pressable>

      <Pressable
        style={[
          styles.primaryButton,
          cartItems.length === 0 && styles.disabledButton,
        ]}
        onPress={() => {
          if (cartItems.length > 0) setScreen("checkout");
        }}
      >
        <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
      </Pressable>
    </ScrollView>
  </>
);
