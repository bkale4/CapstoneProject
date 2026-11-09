// Imports React and components used to display payment management options
import React from "react";
import { Linking, Pressable, ScrollView, Text } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Payment Management screen
import type { PaymentManagementScreenProps } from "../types/types";

// Stores the business's payment account links
// Replace the empty strings with the actual links once the client provides them
const PAYMENT_LINKS = {
  venmo: "",
  paypal: "",
  zelle: "",
};

// Displays the payment services used by the business
export const PaymentManagementScreen = ({
  Header,
  BusinessBackButton,
}: PaymentManagementScreenProps) => (
  <>
    <Header title="Payment Management" />

    <ScrollView contentContainerStyle={styles.content}>
      <BusinessBackButton />

      {/* Displays the Venmo payment management option */}
      <Pressable
        style={styles.card}
        onPress={() => {
          if (PAYMENT_LINKS.venmo) {
            Linking.openURL(PAYMENT_LINKS.venmo).catch((error) => {
              console.error("Unable to open Venmo:", error);
            });
          }
        }}
      >
        <Text style={styles.cardTitle}>Venmo</Text>
        <Text style={styles.cardSubtitle}>
          Access the business Venmo account to verify customer payments.
        </Text>
      </Pressable>

      {/* Displays the PayPal payment management option */}
      <Pressable
        style={styles.card}
        onPress={() => {
          if (PAYMENT_LINKS.paypal) {
            Linking.openURL(PAYMENT_LINKS.paypal).catch((error) => {
              console.error("Unable to open PayPal:", error);
            });
          }
        }}
      >
        <Text style={styles.cardTitle}>PayPal</Text>
        <Text style={styles.cardSubtitle}>
          Access the business PayPal account to verify customer payments.
        </Text>
      </Pressable>

      {/* Displays the Zelle payment management option */}
      <Pressable
        style={styles.card}
        onPress={() => {
          if (PAYMENT_LINKS.zelle) {
            Linking.openURL(PAYMENT_LINKS.zelle).catch((error) => {
              console.error("Unable to open Zelle:", error);
            });
          }
        }}
      >
        <Text style={styles.cardTitle}>Zelle</Text>
        <Text style={styles.cardSubtitle}>
          Access the business banking account to verify Zelle payments.
        </Text>
      </Pressable>
    </ScrollView>
  </>
);
