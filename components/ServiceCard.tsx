import React from "react";
import { Pressable, Text } from "react-native";
import { styles } from "../styles/styles";

// Displays a clickable card with a service title and description
export const ServiceCard = ({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) => (
  <Pressable style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
  </Pressable>
);
