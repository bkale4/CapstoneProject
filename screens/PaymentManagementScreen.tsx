// Imports React and components used to display payment management options
import React from "react";
import { Pressable, ScrollView, Text } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Payment Management screen
import type { PaymentManagementScreenProps } from "../types";

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
      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.cardTitle}>Venmo</Text>
        <Text style={styles.cardSubtitle}>
          Access the business Venmo account to verify customer payments.
        </Text>
      </Pressable>

      {/* Displays the PayPal payment management option */}
      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.cardTitle}>PayPal</Text>
        <Text style={styles.cardSubtitle}>
          Access the business PayPal account to verify customer payments.
        </Text>
      </Pressable>

      {/* Displays the Zelle payment management option */}
      <Pressable style={styles.card} onPress={() => {}}>
        <Text style={styles.cardTitle}>Zelle</Text>
        <Text style={styles.cardSubtitle}>
          Access the business banking account to verify Zelle payments.
        </Text>
      </Pressable>
    </ScrollView>
  </>
);
