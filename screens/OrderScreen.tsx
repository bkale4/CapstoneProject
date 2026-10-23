import React from "react";
import { ScrollView, Text } from "react-native";
import { ServiceCard } from "../components/ServiceCard";
import { styles } from "../styles/styles";
import type { Screen } from "../types";

type OrderScreenProps = {
  Header: ({ title }: { title: string }) => React.JSX.Element;
  isMenuActive: (menuName: string) => boolean;
  foodTrailerLocation: string;
  foodTrailerEventName: string;
  setSelectedMenuType: (value: string) => void;
  setSelectedLocation: (value: string) => void;
  setSelectedEvent: (value: string) => void;
  setScreen: (screen: Screen) => void;
};

// Displays the Order screen and receives the data functions needed for customer navigation
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
