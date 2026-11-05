import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/styles";
import type { Screen } from "../types";

type NavBarProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  isAdminLoggedIn: boolean;
};

// Displays the navigation bar and handles navigation between screens
export const NavBar = ({ setScreen, isAdminLoggedIn }: NavBarProps) => (
  <View style={styles.navBar}>
    <Pressable onPress={() => setScreen("home")}>
      <Text style={styles.navText}>Home</Text>
    </Pressable>
    <Pressable onPress={() => setScreen("about")}>
      <Text style={styles.navText}>About</Text>
    </Pressable>
    <Pressable onPress={() => setScreen("order")}>
      <Text style={styles.navText}>Order</Text>
    </Pressable>
    <Pressable onPress={() => setScreen("catering")}>
      <Text style={styles.navText}>Catering</Text>
    </Pressable>
    <Pressable onPress={() => setScreen("cart")}>
      <Text style={styles.navText}>Cart</Text>
    </Pressable>
    <Pressable
      onPress={() => setScreen(isAdminLoggedIn ? "business" : "businessLogin")}
    >
      <Text style={styles.navText}>Business</Text>
    </Pressable>
  </View>
);

// Creates a NavBar component connected to the application's navigation state
export const createAppNavBar = (
  setScreen: React.Dispatch<React.SetStateAction<Screen>>,
  isAdminLoggedIn: boolean,
) => {
  // Displays the shared navigation bar with the current admin login state
  const AppNavBar = () => (
    <NavBar setScreen={setScreen} isAdminLoggedIn={isAdminLoggedIn} />
  );

  return AppNavBar;
};
