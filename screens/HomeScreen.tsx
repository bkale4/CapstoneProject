import React from "react";
import { ScrollView, Text } from "react-native";
import { ServiceCard } from "../components/ServiceCard";
import { styles } from "../styles/styles";
import type { Screen } from "../types";

type HomeScreenProps = {
  Header: ({ title }: { title: string }) => React.JSX.Element;
  activeFoodTrailerMenu: any;
  foodTrailerLocation: string;
  foodTrailerEventName: string;
  setSelectedMenuType: (value: string) => void;
  setSelectedLocation: (value: string) => void;
  setSelectedEvent: (value: string) => void;
  setScreen: (screen: Screen) => void;
};

export const HomeScreen = ({
  Header,
  activeFoodTrailerMenu,
  foodTrailerLocation,
  foodTrailerEventName,
  setSelectedMenuType,
  setSelectedLocation,
  setSelectedEvent,
  setScreen,
}: HomeScreenProps) => (
  <>
    <Header title="Root & Ranch Catering and Concessions" />
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.welcome}>Choose a service</Text>

      <ServiceCard
        title="Food Trailer"
        subtitle={
          activeFoodTrailerMenu != null
            ? "Browse the active food trailer menu and place a quick order."
            : "The Food Trailer menu is currently unavailable."
        }
        onPress={() => {
          if (activeFoodTrailerMenu !== null) {
            setSelectedMenuType("foodTrailer");
            setSelectedLocation(foodTrailerLocation);
            setSelectedEvent(foodTrailerEventName);
            setScreen("foodTrailer");
          }
        }}
      />

      <ServiceCard
        title="Catering"
        subtitle="Check catering options and submit a request."
        onPress={() => setScreen("catering")}
      />
    </ScrollView>
  </>
);
