// Imports React and the components used for checkout
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Checkout screen
import type {
  CheckoutScreenProps,
  OrderConfirmationScreenProps,
} from "../types";

// Displays customer information, payment options, and the final order
export const CheckoutScreen = ({
  Header,
  isCustomerLoggedIn,
  loggedInCustomerName,
  loggedInCustomerPhone,
  loggedInCustomerEmail,
  setScreen,
  continueAsGuest,
  setContinueAsGuest,
  guestName,
  setGuestName,
  guestPhone,
  setGuestPhone,
  guestEmail,
  setGuestEmail,
  paymentMethod,
  setPaymentMethod,
  cartItems,
  cartTotal,
  submitOrder,
  isSubmittingOrder,
}: CheckoutScreenProps) => (
  <>
    <Header title="Checkout" />
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Customer Account</Text>

        {isCustomerLoggedIn ? (
          <View style={[styles.optionButton, styles.selectedOptionButton]}>
            <Text style={styles.sectionText}>
              Signed in to your customer account.
            </Text>

            <Text style={styles.sectionText}>Name: {loggedInCustomerName}</Text>

            <Text style={styles.sectionText}>
              Phone: {loggedInCustomerPhone}
            </Text>

            <Text style={styles.sectionText}>
              Email: {loggedInCustomerEmail}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionText}>
              Sign in, create an account, or continue as a guest.
            </Text>

            <Pressable
              style={styles.optionButton}
              onPress={() => setScreen("customerLogin")}
            >
              <Text style={styles.optionText}>Sign In</Text>
            </Pressable>

            <Pressable
              style={styles.optionButton}
              onPress={() => setScreen("createAccount")}
            >
              <Text style={styles.optionText}>Create Account</Text>
            </Pressable>

            <Pressable
              style={[
                styles.optionButton,
                continueAsGuest && styles.selectedOptionButton,
              ]}
              onPress={() => setContinueAsGuest(true)}
            >
              <Text style={styles.optionText}>Continue as Guest</Text>
            </Pressable>
          </>
        )}
      </View>

      {continueAsGuest && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#555"
            value={guestName}
            onChangeText={setGuestName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#555"
            value={guestPhone}
            onChangeText={setGuestPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#555"
            value={guestEmail}
            onChangeText={setGuestEmail}
          />
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Method</Text>

        {["Cash", "Venmo", "PayPal", "Zelle"].map((method) => (
          <Pressable
            key={method}
            style={[
              styles.optionButton,
              paymentMethod === method && styles.selectedOption,
            ]}
            onPress={() => setPaymentMethod(method)}
          >
            <Text
              style={[
                styles.optionText,
                paymentMethod === method && styles.selectedOptionText,
              ]}
            >
              {method}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Final Order</Text>
        {cartItems.map((item) => (
          <Text key={item.id} style={styles.summaryLine}>
            {item.name} x {item.quantity} - $
            {(item.price * item.quantity).toFixed(2)}
          </Text>
        ))}
        <Text style={styles.summaryTotal}>Total: ${cartTotal.toFixed(2)}</Text>
      </View>

      <Pressable
        style={[
          styles.primaryButton,
          isSubmittingOrder && styles.disabledButton,
        ]}
        onPress={submitOrder}
        disabled={isSubmittingOrder}
      >
        <Text style={styles.primaryButtonText}>
          {isSubmittingOrder ? "Placing Order..." : "Place Order"}
        </Text>
      </Pressable>
    </ScrollView>
  </>
);

// Displays the order confirmation details after a customer places an order
export const OrderConfirmationScreen = ({
  Header,
  paymentMethod,
  cartTotal,
  setScreen,
}: OrderConfirmationScreenProps) => (
  <>
    <Header title="Order Confirmed" />
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>Thank You!</Text>
        <Text style={styles.summaryLine}>
          Your order has been successfully placed.
        </Text>
        <Text style={styles.summaryLine}>Order Number: #1042</Text>
        <Text style={styles.summaryLine}>Estimated Ready Time: 20 minutes</Text>
        <Text style={styles.summaryLine}>Payment Method: {paymentMethod}</Text>
        <Text style={styles.summaryTotal}>Total: ${cartTotal.toFixed(2)}</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => setScreen("home")}>
        <Text style={styles.primaryButtonText}>Return Home</Text>
      </Pressable>
    </ScrollView>
  </>
);
