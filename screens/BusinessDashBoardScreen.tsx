// Imports React and the components used to display the Business Dashboard
import React from "react";
import { Pressable, ScrollView, Text } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

import type { BusinessDashBoardScreenProps } from "../types/types";

// Imports the navigation state type and React state setter types
import type { Dispatch, SetStateAction } from "react";
import type { Screen } from "../types/types";

// Displays the Business Dashboard and its admin management options
export const BusinessDashboardScreen = ({
  Header,
  loadAdminOrders,
  loadCateringRequests,
  loadAdminMenus,
  setScreen,
}: BusinessDashBoardScreenProps) => (
  <>
    <Header title="Business Dashboard" />
    <ScrollView contentContainerStyle={styles.content}>
      {/* Displays the Incoming Orders card */}
      <Pressable
        style={styles.card}
        onPress={async () => {
          await loadAdminOrders();
          setScreen("ordersManagement");
        }}
      >
        <Text style={styles.cardTitle}>Incoming Orders</Text>
        <Text style={styles.cardSubtitle}>
          Track food orders and update status.
        </Text>
      </Pressable>

      {/* Loads customer catering requests before opening Catering Management */}
      <Pressable
        style={styles.card}
        onPress={async () => {
          await loadCateringRequests();
          setScreen("cateringManagement");
        }}
      >
        <Text style={styles.cardTitle}>Catering Requests</Text>
        <Text style={styles.cardSubtitle}>
          Review, accept, decline, or follow up.
        </Text>
      </Pressable>

      {/* Opens the admin Catering Events screen */}
      <Pressable
        style={styles.card}
        onPress={async () => {
          await loadCateringRequests();
          setScreen("cateringEvents");
        }}
      >
        <Text style={styles.cardTitle}>Catering Events</Text>
        <Text style={styles.cardSubtitle}>
          View accepted catering events and their details
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={async () => {
          await loadAdminMenus();
          setScreen("menuManagement");
        }}
      >
        <Text style={styles.cardTitle}>Menu Management</Text>
        <Text style={styles.cardSubtitle}>
          Update menus by service context.
        </Text>
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => setScreen("availabilityManagement")}
      >
        <Text style={styles.cardTitle}>Availability Management</Text>
        <Text style={styles.cardSubtitle}>Adjust the catering calendar.</Text>
      </Pressable>
    </ScrollView>
  </>
);

// Defines the navigation information required by the Business Dashboard back button
interface BusinessBackButtonProps {
  setScreen: Dispatch<SetStateAction<Screen>>;
}

// Displays a button that requires the admin to the Business Dashboard
export const BusinessBackButton = ({ setScreen }: BusinessBackButtonProps) => (
  <Pressable
    style={styles.secondaryButton}
    onPress={() => setScreen("business")}
  >
    <Text style={styles.secondaryButtonText}>Back to Business Dashboard</Text>
  </Pressable>
);
