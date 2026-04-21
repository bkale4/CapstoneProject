import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Screen =
  | "home"
  | "order"
  | "foodTrailer"
  | "onsiteEvent"
  | "cart"
  | "checkout"
  | "orderConfirmation"
  | "catering"
  | "cateringRequest"
  | "business";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [cartTotal, setCartTotal] = useState(0);

  const addToCart = (price: number) => {
    setCartTotal((prev) => prev + price);
  };

  const Header = ({ title }: { title: string }) => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );

  const NavBar = () => (
    <View style={styles.navBar}>
      <Pressable onPress={() => setScreen("home")}>
        <Text style={styles.navText}>Home</Text>
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
      <Pressable onPress={() => setScreen("business")}>
        <Text style={styles.navText}>Business</Text>
      </Pressable>
    </View>
  );

  const ServiceCard = ({
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

  const MenuItem = ({
    name,
    description,
    price,
  }: {
    name: string;
    description: string;
    price: number;
  }) => (
    <View style={styles.menuItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuName}>{name}</Text>
        <Text style={styles.menuDescription}>{description}</Text>
        <Text style={styles.menuPrice}>${price.toFixed(2)}</Text>
      </View>
      <Pressable style={styles.addButton} onPress={() => addToCart(price)}>
        <Text style={styles.addButtonText}>Add</Text>
      </Pressable>
    </View>
  );

  const HomeScreen = () => (
    <>
      <Header title="Root & Ranch Catering and Concessions" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcome}>Choose a service</Text>

        <ServiceCard
          title="Food Trailer"
          subtitle="Browse the active food trailer menu and place a quick order."
          onPress={() => setScreen("foodTrailer")}
        />

        <ServiceCard
          title="Onsite Event"
          subtitle="View event-specific menu options and order food."
          onPress={() => setScreen("onsiteEvent")}
        />

        <ServiceCard
          title="Catering"
          subtitle="Check catering options and submit a request."
          onPress={() => setScreen("catering")}
        />
      </ScrollView>
    </>
  );

  const OrderScreen = () => (
    <>
      <Header title="Order Food" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcome}>Choose an ordering option</Text>

        <ServiceCard
          title="Food Trailer"
          subtitle="Browse the active food trailer menu and place a quick order."
          onPress={() => setScreen("foodTrailer")}
        />

        <ServiceCard
          title="Onsite Event"
          subtitle="View event-specific menu options and place an order."
          onPress={() => setScreen("onsiteEvent")}
        />
      </ScrollView>
    </>
  );

  const FoodTrailerScreen = () => (
    <>
      <Header title="Food Trailer Menu" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionText}>
          Now Serving: Mount St. Mary's Campus
        </Text>
        <Text style={styles.sectionText}>Hours: 11:00 AM - 6:00 PM</Text>

        <MenuItem
          name="Pulled Pork Sandwich"
          description="Smoked pork with house BBQ sauce"
          price={12}
        />
        <MenuItem
          name="Mac and Cheese"
          description="Creamy side dish"
          price={5}
        />
        <MenuItem
          name="Sweet Tea"
          description="Fresh brewed sweet tea"
          price={3}
        />

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("cart")}
        >
          <Text style={styles.primaryButtonText}>
            View Cart - ${cartTotal.toFixed(2)}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const OnsiteEventScreen = () => (
    <>
      <Header title="Onsite Event Menu" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionText}>
          Current Event: Campus Celebration
        </Text>

        <MenuItem
          name="BBQ Chicken Plate"
          description="Chicken with baked beans and slaw"
          price={14}
        />
        <MenuItem
          name="Loaded Fries"
          description="Fries topped with cheese and pulled pork"
          price={8}
        />
        <MenuItem name="Lemonade" description="Fresh lemonade" price={3} />

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("cart")}
        >
          <Text style={styles.primaryButtonText}>
            View Cart - ${cartTotal.toFixed(2)}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CartScreen = () => (
    <>
      <Header title="Cart / Order Review" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Your Order</Text>
          <Text style={styles.summaryLine}>Pulled Pork Sandwich - $12.00</Text>
          <Text style={styles.summaryLine}>Mac and Cheese - $5.00</Text>
          <Text style={styles.summaryLine}>Sweet Tea - $3.00</Text>
          <Text style={styles.summaryTotal}>
            Total: ${cartTotal.toFixed(2)}
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("checkout")}
        >
          <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CheckoutScreen = () => (
    <>
      <Header title="Checkout" />
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput style={styles.input} placeholder="Full Name" />
        <TextInput style={styles.input} placeholder="Phone Number" />
        <TextInput style={styles.input} placeholder="Email Address" />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Options</Text>
          <Text style={styles.cardSubtitle}>Pickup / Curbside / Delivery</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Final Total</Text>
          <Text style={styles.summaryTotal}>${cartTotal.toFixed(2)}</Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("orderConfirmation")}
        >
          <Text style={styles.primaryButtonText}>Place Order</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const OrderConfirmationScreen = () => (
    <>
      <Header title="Order Confirmed" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Thank You!</Text>
          <Text style={styles.summaryLine}>
            Your order has been successfully placed.
          </Text>
          <Text style={styles.summaryLine}>Order Number: #1042</Text>
          <Text style={styles.summaryLine}>Delivery Method: Pickup</Text>
          <Text style={styles.summaryLine}>
            Estimated Ready Time: 20 minutes
          </Text>
          <Text style={styles.summaryTotal}>
            Total: ${cartTotal.toFixed(2)}
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("home")}
        >
          <Text style={styles.primaryButtonText}>Return Home</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CateringScreen = () => (
    <>
      <Header title="Catering Services" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Catering Menu</Text>
          <Text style={styles.cardSubtitle}>
            View catering-specific menu options and packages.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Availability Calendar</Text>
          <Text style={styles.cardSubtitle}>
            Available dates and unavailable dates would be shown here.
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("cateringRequest")}
        >
          <Text style={styles.primaryButtonText}>Start Catering Request</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CateringRequestScreen = () => (
    <>
      <Header title="Catering Request Form" />
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput style={styles.input} placeholder="Preferred Date" />
        <TextInput style={styles.input} placeholder="Preferred Time" />
        <TextInput style={styles.input} placeholder="Estimated Guest Count" />
        <TextInput style={styles.input} placeholder="Menu Preferences" />
        <TextInput style={styles.input} placeholder="Contact Information" />
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Special Notes"
          multiline
        />

        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Submit Catering Request</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const BusinessScreen = () => (
    <>
      <Header title="Business Dashboard" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incoming Orders</Text>
          <Text style={styles.cardSubtitle}>
            Track food orders and delivery methods.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Catering Requests</Text>
          <Text style={styles.cardSubtitle}>
            Review, accept, decline, or follow up.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Menu Management</Text>
          <Text style={styles.cardSubtitle}>
            Update menus by service context.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Availability Management</Text>
          <Text style={styles.cardSubtitle}>Adjust the catering calendar.</Text>
        </View>
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {screen === "home" && <HomeScreen />}
      {screen === "order" && <OrderScreen />}
      {screen === "foodTrailer" && <FoodTrailerScreen />}
      {screen === "onsiteEvent" && <OnsiteEventScreen />}
      {screen === "cart" && <CartScreen />}
      {screen === "checkout" && <CheckoutScreen />}
      {screen === "orderConfirmation" && <OrderConfirmationScreen />}
      {screen === "catering" && <CateringScreen />}
      {screen === "cateringRequest" && <CateringRequestScreen />}
      {screen === "business" && <BusinessScreen />}
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f4ef",
  },
  header: {
    backgroundColor: "#2f241f",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#5a514c",
  },
  sectionText: {
    fontSize: 15,
    color: "#4f4641",
    marginBottom: 6,
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuName: {
    fontSize: 17,
    fontWeight: "700",
  },
  menuDescription: {
    fontSize: 14,
    color: "#5a514c",
    marginTop: 4,
  },
  menuPrice: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
  },
  addButton: {
    backgroundColor: "#2f241f",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#2f241f",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  summaryBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  summaryLine: {
    fontSize: 14,
    color: "#5a514c",
    marginBottom: 6,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  navBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ddd5ce",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
  },
  navText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2f241f",
  },
});
