import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const [total, setTotal] = useState(0);

  const addItem = (price: number) => {
    setTotal(total + price);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Root & Ranch Catering</Text>
        <Text style={styles.subtitle}>Demo Ordering App</Text>

        <View style={styles.card}>
          <Text style={styles.itemName}>BBQ Sandwich</Text>
          <Text style={styles.itemPrice}>$10</Text>
          <Pressable style={styles.button} onPress={() => addItem(10)}>
            <Text style={styles.buttonText}>Add to Order</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.itemName}>Mac and Cheese</Text>
          <Text style={styles.itemPrice}>$5</Text>
          <Pressable style={styles.button} onPress={() => addItem(5)}>
            <Text style={styles.buttonText}>Add to Order</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.itemName}>Lemonade</Text>
          <Text style={styles.itemPrice}>$3</Text>
          <Pressable style={styles.button} onPress={() => addItem(3)}>
            <Text style={styles.buttonText}>Add to Order</Text>
          </Pressable>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalText}>Order Total: ${total}</Text>
        </View>

        <Text style={styles.footer}>
          Catering requests could be added as another screen in the full app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f4f1",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },
  itemName: {
    fontSize: 20,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#222222",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  totalBox: {
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#e8dfd8",
    borderRadius: 10,
    width: "100%",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
});
