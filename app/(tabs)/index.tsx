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
  | "about"
  | "order"
  | "foodTrailer"
  | "onsiteEvent"
  | "cart"
  | "checkout"
  | "orderConfirmation"
  | "catering"
  | "availabilityCalendar"
  | "cateringRequest"
  | "cateringConfirmation"
  | "businessLogin"
  | "business"
  | "ordersManagement"
  | "cateringManagement"
  | "menuManagement"
  | "availabilityManagement";

type BusinessLoginScreenProps = {
  Header: ({ title }: { title: string }) => React.JSX.Element;
  styles: any;
  adminUsername: string;
  setAdminUsername: React.Dispatch<React.SetStateAction<string>>;
  adminPassword: string;
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>;
  handleBusinessLogin: () => void;
  loginMessage: string;
};

function BusinessLoginScreen({
  Header,
  styles,
  adminUsername,
  setAdminUsername,
  adminPassword,
  setAdminPassword,
  handleBusinessLogin,
  loginMessage,
}: BusinessLoginScreenProps) {
  return (
    <>
      <Header title="Business Login" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin Access Only</Text>
          <Text style={styles.cardSubtitle}>
            This section is restricted and is not for public customer use.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={adminUsername}
          onChangeText={setAdminUsername}
          autoCapitalize="none"
          placeholderTextColor="#555"
          blurOnSubmit={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={adminPassword}
          onChangeText={setAdminPassword}
          autoCapitalize="none"
          placeholderTextColor="#555"
          blurOnSubmit={false}
        />

        <Pressable style={styles.primaryButton} onPress={handleBusinessLogin}>
          <Text style={styles.primaryButtonText}>Log In</Text>
        </Pressable>

        {loginMessage !== "" && (
          <Text style={styles.errorText}>{loginMessage}</Text>
        )}
      </ScrollView>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setvenueAddress] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  const toggleAvailability = (dateKey: string) => {
    setAvailability((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey] === false,
    }));
  };

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const goToPreviousMonth = () => {
    if (currentMonth == 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth == 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const addToCart = (id: string, name: string, price: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prev, { id, name, price, quantity: 1 }];
    });
  };
  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleBusinessLogin = () => {
    if (adminUsername === "admin" && adminPassword === "12345") {
      setLoginMessage("");
      setIsAdminLoggedIn(true);
      setScreen("business");
    } else {
      setLoginMessage("Access Denied. This area is for admin use only.");
    }
  };

  const BusinessBackButton = () => (
    <Pressable
      style={styles.secondaryButton}
      onPress={() => setScreen("business")}
    >
      <Text style={styles.secondaryButtonText}>Back to Business Dashboard</Text>
    </Pressable>
  );

  const Header = ({ title }: { title: string }) => (
    <View style={styles.header}>
      <Pressable
        style={styles.logoPlaceholder}
        onPress={() => setScreen("home")}
      >
        <Text style={styles.logoText}>Logo</Text>
      </Pressable>

      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );

  const NavBar = () => (
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
        onPress={() =>
          setScreen(isAdminLoggedIn ? "business" : "businessLogin")
        }
      >
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
    id,
    name,
    description,
    price,
    status,
  }: {
    id: string;
    name: string;
    description: string;
    price: number;
    status?: "Available" | "Limited" | "Sold Out";
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
      </View>
    );
  };

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

  const AboutScreen = () => (
    <>
      <Header title="About Root & Ranch" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Us</Text>
          <Text style={styles.cardSubtitle}>
            Root & Ranch focuses on food quality and sustainability using
            locally sourced ingredients while also having a positive impact on
            our customers and community with the support of our enthusiastic and
            friendly team.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <Text style={styles.cardSubtitle}>Phone: (443) 289-6423</Text>
          <Text style={styles.cardSubtitle}>
            Email: rootandranchub@outlook.com
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Social Media</Text>
          <Text style={styles.cardSubtitle}>
            Facebook: Root & Ranch Catering and Concessions
          </Text>
        </View>
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
          id="pulled-pork-sandwich"
          name="Pulled Pork Sandwich"
          description="Smoked pork with house BBQ sauce"
          price={12}
          status="Available"
        />
        <MenuItem
          id="mac-and-cheese"
          name="Mac and Cheese"
          description="Creamy side dish"
          price={5}
          status="Limited"
        />
        <MenuItem
          id="sweet-tea"
          name="Sweet Tea"
          description="Fresh brewed sweet tea"
          price={3}
          status="Sold Out"
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
          id="bbq-chicken-plate"
          name="BBQ Chicken Plate"
          description="Chicken with baked beans and slaw"
          price={14}
        />
        <MenuItem
          id="loaded-fries"
          name="Loaded Fries"
          description="Fries topped with cheese and pulled pork"
          price={8}
        />
        <MenuItem
          id="lemonade"
          name="Lemonade"
          description="Fresh lemonade"
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

  const CartScreen = () => (
    <>
      <Header title="Cart / Order Review" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Your Order</Text>

          {cartItems.length === 0 ? (
            <Text style={styles.summaryLine}>Your cart is empty.</Text>
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.cartItemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.summaryLine}>
                    ${item.price.toFixed(2)} each
                  </Text>
                  <Text style={styles.summaryLine}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.quantityControls}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => decreaseQuantity(item.id)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => increaseQuantity(item.id)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}

          <Text style={styles.summaryTotal}>
            Total: ${cartTotal.toFixed(2)}
          </Text>
        </View>

        <Pressable style={styles.secondaryButton} onPress={clearCart}>
          <Text style={styles.secondaryButtonText}>Clear Cart</Text>
        </Pressable>

        <Pressable
          style={[
            styles.primaryButton,
            cartItems.length === 0 && styles.disabledButton,
          ]}
          onPress={() => {
            if (cartItems.length > 0) setScreen("checkout");
          }}
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
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#555"
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>

          {["Cash", "Venmo", "PayPal", "Zelle"].map((method) => (
            <Pressable
              key={method}
              style={[
                styles.optionButton,
                paymentMethod === method && styles.selectedOption,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text
                style={[
                  styles.optionText,
                  paymentMethod === method && styles.selectedOptionText,
                ]}
              >
                {method}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Final Order</Text>
          {cartItems.map((item) => (
            <Text key={item.id} style={styles.summaryLine}>
              {item.name} x {item.quantity} - $
              {(item.price * item.quantity).toFixed(2)}
            </Text>
          ))}
          <Text style={styles.summaryTotal}>
            Total: ${cartTotal.toFixed(2)}
          </Text>
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
          <Text style={styles.summaryLine}>
            Estimated Ready Time: 20 minutes
          </Text>
          <Text style={styles.summaryLine}>
            Payment Method: {paymentMethod}
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

        <Pressable
          style={styles.card}
          onPress={() => setScreen("availabilityCalendar")}
        >
          <Text style={styles.cardTitle}>Availability Calendar</Text>
          <Text style={styles.cardSubtitle}>
            Available dates and unavailable dates would be shown here.
          </Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("cateringRequest")}
        >
          <Text style={styles.primaryButtonText}>Start Catering Request</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const AvailabilityCalendarScreen = () => (
    <>
      <Header title="Catering Availability" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.calendarHeader}>
            <Pressable
              style={styles.calendarNavButton}
              onPress={goToPreviousMonth}
            >
              <Text style={styles.calendarNavText}>‹</Text>
            </Pressable>

            <Text style={styles.cardTitle}>
              {monthNames[currentMonth]} {currentYear}
            </Text>

            <Pressable style={styles.calendarNavButton} onPress={goToNextMonth}>
              <Text style={styles.calendarNavText}>›</Text>
            </Pressable>
          </View>

          <Text style={styles.cardSubtitle}>
            View available dates for catering requests.
          </Text>
        </View>

        <View style={styles.calendar}>
          <View style={styles.weekRow}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <View key={`blank-${index}`} style={styles.calendarDay} />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;

              const dateKey = `${currentYear}-${String(
                currentMonth + 1,
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

              const isAvailable = availability[dateKey] !== false;

              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <View
                  key={dateKey}
                  style={[
                    styles.calendarDay,
                    isAvailable ? styles.availableDay : styles.unavailableDay,
                    isToday && styles.todayDay,
                  ]}
                >
                  <Text style={styles.calendarDayNumber}>{day}</Text>

                  <Text style={styles.calendarStatus}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Legend</Text>

          <Text style={styles.cardSubtitle}>
            Available = open for catering requests
          </Text>

          <Text style={styles.cardSubtitle}>
            Unavailable = already booked or not accepting requests
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("cateringRequest")}
        >
          <Text style={styles.primaryButtonText}>Continue to Request Form</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CateringRequestScreen = () => (
    <>
      <Header title="Catering Request Form" />
      <ScrollView contentContainerStyle={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Preferred Date"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          placeholder="Preferred Time"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          placeholder="Estimated Guest Count"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          placeholder="Menu Preferences"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Information"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          placeholder="Venue Name"
          placeholderTextColor="#555"
        />
        <TextInput
          style={styles.input}
          placeholder="Venue Address"
          placeholderTextColor="#555"
        />
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Special Notes"
          placeholderTextColor="#555"
          multiline
        />

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("cateringConfirmation")}
        >
          <Text style={styles.primaryButtonText}>Submit Catering Request</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CateringConfirmationScreen = () => (
    <>
      <Header title="Request Submitted" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Thank You!</Text>
          <Text style={styles.summaryLine}>
            Your catering request has been submitted successfully.
          </Text>
          <Text style={styles.summaryLine}>
            A member of Root & Ranch Catering will review your request.
          </Text>
          <Text style={styles.summaryLine}>Status: Pending approval</Text>
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

  const BusinessScreen = () => (
    <>
      <Header title="Business Dashboard" />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.card}
          onPress={() => setScreen("ordersManagement")}
        >
          <Text style={styles.cardTitle}>Incoming Orders</Text>
          <Text style={styles.cardSubtitle}>
            Track food orders and update status.
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => setScreen("cateringManagement")}
        >
          <Text style={styles.cardTitle}>Catering Requests</Text>
          <Text style={styles.cardSubtitle}>
            Review, accept, decline, or follow up.
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => setScreen("menuManagement")}
        >
          <Text style={styles.cardTitle}>Menu Management</Text>
          <Text style={styles.cardSubtitle}>
            Update menus by service context.
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => setScreen("availabilityManagement")}
        >
          <Text style={styles.cardTitle}>Availability Management</Text>
          <Text style={styles.cardSubtitle}>Adjust the catering calendar.</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const OrdersManagementScreen = () => (
    <>
      <Header title="Incoming Orders" />
      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order #1042</Text>
          <Text style={styles.cardSubtitle}>Customer: John Doe</Text>
          <Text style={styles.cardSubtitle}>
            Items: Pulled Pork Sandwich, Sweet Tea
          </Text>
          <Text style={styles.cardSubtitle}>Status: Preparing</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order #1043</Text>
          <Text style={styles.cardSubtitle}>Customer: Jane Doe</Text>
          <Text style={styles.cardSubtitle}>
            Items: BBQ Chicken Plate, Lemonade
          </Text>
          <Text style={styles.cardSubtitle}>Status: Ready for Pickup</Text>
        </View>
      </ScrollView>
    </>
  );

  const CateringManagementScreen = () => (
    <>
      <Header title="Catering Requests" />
      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Request #C201</Text>
          <Text style={styles.cardSubtitle}>Date: May 21, 2026</Text>
          <Text style={styles.cardSubtitle}>Guests: 45</Text>
          <Text style={styles.cardSubtitle}>
            Menu Preference: Sandwich Platters
          </Text>
          <Text style={styles.cardSubtitle}>Status: Follow Up Needed</Text>
        </View>
      </ScrollView>
    </>
  );

  const MenuManagementScreen = () => (
    <>
      <Header title="Menu Management" />
      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Food Trailer Menu</Text>
          <Text style={styles.cardSubtitle}>Pulled Pork Sandwich</Text>
          <Text style={styles.cardSubtitle}>Mac and Cheese</Text>
          <Text style={styles.cardSubtitle}>Sweet Tea</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Onsite Event Menu</Text>
          <Text style={styles.cardSubtitle}>BBQ Chicken Plate</Text>
          <Text style={styles.cardSubtitle}>Loaded Fries</Text>
          <Text style={styles.cardSubtitle}>Lemonade</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Catering Menu</Text>
          <Text style={styles.cardSubtitle}>BBQ Buffet</Text>
          <Text style={styles.cardSubtitle}>Sandwich Platters</Text>
          <Text style={styles.cardSubtitle}>Family-Style Sides</Text>
        </View>
      </ScrollView>
    </>
  );

  const AvailabilityManagementScreen = () => (
    <>
      <Header title="Availability Management" />

      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />

        <View style={styles.card}>
          <View style={styles.calendarHeader}>
            <Pressable
              style={styles.calendarNavButton}
              onPress={goToPreviousMonth}
            >
              <Text style={styles.calendarNavText}>‹</Text>
            </Pressable>

            <Text style={styles.cardTitle}>
              {monthNames[currentMonth]} {currentYear}
            </Text>

            <Pressable style={styles.calendarNavButton} onPress={goToNextMonth}>
              <Text style={styles.calendarNavText}>›</Text>
            </Pressable>
          </View>

          <Text style={styles.cardSubtitle}>
            Tap a date to change its availability.
          </Text>
        </View>

        <View style={styles.calendar}>
          <View style={styles.weekRow}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <View key={`blank-${index}`} style={styles.calendarDay} />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;

              const dateKey = `${currentYear}-${String(
                currentMonth + 1,
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

              const isAvailable = availability[dateKey] !== false;

              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <Pressable
                  key={dateKey}
                  onPress={() => toggleAvailability(dateKey)}
                  style={[
                    styles.calendarDay,
                    isAvailable ? styles.availableDay : styles.unavailableDay,
                    isToday && styles.todayDay,
                  ]}
                >
                  <Text style={styles.calendarDayNumber}>{day}</Text>

                  <Text style={styles.calendarStatus}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How It Works</Text>

          <Text style={styles.cardSubtitle}>
            Tap an available date to mark it unavailable.
          </Text>

          <Text style={styles.cardSubtitle}>
            Tap an unavailable date to make it available again.
          </Text>
        </View>
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {screen === "home" && <HomeScreen />}
      {screen === "about" && <AboutScreen />}
      {screen === "order" && <OrderScreen />}
      {screen === "foodTrailer" && <FoodTrailerScreen />}
      {screen === "onsiteEvent" && <OnsiteEventScreen />}
      {screen === "cart" && <CartScreen />}
      {screen === "checkout" && <CheckoutScreen />}
      {screen === "orderConfirmation" && <OrderConfirmationScreen />}
      {screen === "catering" && <CateringScreen />}
      {screen === "availabilityCalendar" && <AvailabilityCalendarScreen />}
      {screen === "cateringRequest" && <CateringRequestScreen />}
      {screen === "cateringConfirmation" && <CateringConfirmationScreen />}
      {screen === "businessLogin" && (
        <BusinessLoginScreen
          Header={Header}
          styles={styles}
          adminUsername={adminUsername}
          setAdminUsername={setAdminUsername}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          handleBusinessLogin={handleBusinessLogin}
          loginMessage={loginMessage}
        />
      )}
      {screen === "business" && <BusinessScreen />}
      {screen === "ordersManagement" && <OrdersManagementScreen />}
      {screen === "availabilityManagement" && <AvailabilityManagementScreen />}
      {screen === "menuManagement" && <MenuManagementScreen />}
      {screen === "cateringManagement" && <CateringManagementScreen />}
      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F1E7",
  },
  header: {
    backgroundColor: "#3f5b3a",
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f6f1e7",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#3f5b3a",
    fontSize: 12,
    fontWeight: "700",
  },
  headerTitle: {
    color: "#ffffff",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "D8C3A5",
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
  statusText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
  },
  limitedText: {
    color: "#8a5a00",
  },
  soldOutText: {
    color: "#a12626",
  },
  disabledButton: {
    opacity: 0.5,
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
    backgroundColor: "#3F5B3A",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#D8C3A5",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#5C4033",
    fontSize: 16,
    fontWeight: "700",
  },
  summaryBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  cartItemRow: {
    backgroundColor: "#f7f4ef",
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  quantityButton: {
    backgroundColor: "#2f241f",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  quantityButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    marginTop: 10,
  },
  removeButtonText: {
    color: "#a12626",
    fontWeight: "600",
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
  optionButton: {
    backgroundColor: "f3efea",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#d8d0c8",
  },
  selectedOption: {
    backgroundColor: "#3f5b3a",
    borderColor: "#3f5b3a",
  },
  optionText: {
    fontSize: 15,
    color: "#2f241f",
    fontWeight: "600",
  },
  selectedOptionText: {
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
    color: "#2F241F",
    borderWidth: 1,
    borderColor: "#D8C3A5",
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#5C4033",
    paddingVertical: 12,
  },
  navText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#F6F1E7",
  },
  errorText: {
    color: "#a12626",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  calendar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 12,
    color: "#5a514c",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    minHeight: 58,
    borderWidth: 1,
    borderColor: "#D8C3A5",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  availableDay: {
    backgroundColor: "#E7efe4",
  },
  unavailableDay: {
    backgroundColor: "#f3d8d8",
  },
  calendarDayNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2f241f",
  },
  calendarStatus: {
    fontSize: 9,
    marginTop: 4,
    textAlign: "center",
    color: "#5a514c",
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarNavButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  calendarNavText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3f5b3a",
  },
  todayDay: {
    borderWidth: 3,
    borderColor: "#3f5b3a",
  },
});
