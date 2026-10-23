import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles/styles";

type HeaderProps = {
  title: string;
  onHomePress: () => void;
};

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
