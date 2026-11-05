import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles/styles";

type HeaderProps = {
  title: string;
  onHomePress: () => void;
};

// Displays the screen title and logo with Home navigation
export function Header({ title, onHomePress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.logoContainer} onPress={onHomePress}>
        <Image
          source={require("../assets/images/root-ranch-logo.png")}
          style={styles.logoImage}
        />
      </Pressable>

      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

// Creates a Header component with the application's Home navigation
export const createHomeHeader = (onHomePress: () => void) => {
  // Displays the shared Header with its Home navigation configured
  const HomeHeader = ({ title }: { title: string }) => (
    <Header title={title} onHomePress={onHomePress} />
  );

  return HomeHeader;
};
