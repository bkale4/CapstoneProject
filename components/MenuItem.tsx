import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/styles";

// Displays a menu item's name, description, price, availability, and Add to cart button
export const MenuItem = ({
  id,
  name,
  description,
  price,
  status,
  allowOrdering = true,
  addToCart,
}: {
  id: string;
  name: string;
  description: string;
  price: number;
  status?: "Available" | "Limited" | "Sold Out";
  allowOrdering?: boolean;
  addToCart: (id: string, name: string, price: number) => void;
}) => {
  const isSoldOut = status === "Sold Out";

  return (
    <View style={styles.menuItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuName}>{name}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
        <Text style={styles.menuPrice}>${price.toFixed(2)}</Text>

        {status && status !== "Available" && (
          <Text
            style={[
              styles.statusText,
              status === "Sold Out" ? styles.soldOutText : styles.limitedText,
            ]}
          >
            {status}
          </Text>
        )}
      </View>

      {allowOrdering && (
        <Pressable
          style={[styles.addButton, isSoldOut && styles.disabledButton]}
          onPress={() => {
            if (!isSoldOut) addToCart(id, name, price);
          }}
        >
          <Text style={styles.addButtonText}>
            {isSoldOut ? "Unavailable" : "Add"}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
