import React from "react";
import { ScrollView, Text } from "react-native";
import { ServiceCard } from "../components/ServiceCard";
import { styles } from "../styles/styles";
import type { OrderScreenProps } from "../types";

// Displays the Order screen and allows customers to select the Food Trailer menu
export const OrderScreen = ({
  Header,
  isMenuActive,
  foodTrailerLocation,
  foodTrailerEventName,
  setSelectedMenuType,
  setSelectedLocation,
  setSelectedEvent,
  setScreen,
}: OrderScreenProps) => (
  <>
    <Header title="Order Food" />
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.welcome}>Choose an ordering option</Text>

      <ServiceCard
        title="Food Trailer"
        subtitle={
          isMenuActive("Food Trailer Menu")
            ? "Browse the active food trailer menu and place a quick order."
            : "The Food Trailer menu is currently unavailable."
        }
        onPress={() => {
          if (isMenuActive("Food Trailer Menu")) {
            setSelectedMenuType("foodTrailer");
            setSelectedLocation(foodTrailerLocation);
            setSelectedEvent(foodTrailerEventName);
            setScreen("foodTrailer");
          }
        }}
      />
    </ScrollView>
  </>
);
