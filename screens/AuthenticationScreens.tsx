// Imports React and the components used to display the login screens
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Business and Customer Login screens
import type {
  BusinessLoginScreenProps,
  CreateAccountScreenProps,
  CustomerLoginScreenProps,
} from "../types/types";

// Displays the admin login form
export function BusinessLoginScreen({
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

        {/* Displays the Customer Name label above the input */}
        <Text style={styles.label}>Admin Username *</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={adminUsername}
          onChangeText={setAdminUsername}
          autoCapitalize="none"
          placeholderTextColor="#555"
          blurOnSubmit={false}
        />

        {/* Displays the Customer Name label above the input */}
        <Text style={styles.label}>Admin Password *</Text>
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

// Displays the Customer Login screen and handles customer sign-in
export const CustomerLoginScreen = ({
  Header,
  customerEmail,
  setCustomerEmail,
  customerPassword,
  setCustomerPassword,
  handleCustomerLogin,
  customerLoginMessage,
  setScreen,
}: CustomerLoginScreenProps) => (
  <>
    <Header title="Customer Sign In" />
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionText}>Sign in to your customer account.</Text>

      {/* Explains which customer login fields are required */}
      <Text style={{ color: "#555", marginBottom: 10 }}>
        * Indicates a required field
      </Text>

      {/* Displays the Customer Email label above the input */}
      <Text style={styles.label}>Customer Email *</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address *"
        placeholderTextColor="#555"
        value={customerEmail}
        onChangeText={setCustomerEmail}
      />

      {/* Displays the Customer Password label above the input */}
      <Text style={styles.label}>Customer Password *</Text>
      <TextInput
        style={styles.input}
        placeholder="Password *"
        placeholderTextColor="#555"
        secureTextEntry
        value={customerPassword}
        onChangeText={setCustomerPassword}
      />

      <Pressable style={styles.primaryButton} onPress={handleCustomerLogin}>
        <Text style={styles.primaryButtonText}>Sign In</Text>
      </Pressable>

      {customerLoginMessage !== "" && (
        <Text style={styles.sectionText}>{customerLoginMessage}</Text>
      )}

      <Pressable onPress={() => setScreen("checkout")}>
        <Text style={styles.optionText}>Back to Checkout</Text>
      </Pressable>
    </ScrollView>
  </>
);

// Displays the Create Account screen and handles customer registration
export const CreateAccountScreen = ({
  Header,
  newCustomerName,
  setNewCustomerName,
  newCustomerPhone,
  setNewCustomerPhone,
  newCustomerEmail,
  setNewCustomerEmail,
  newCustomerPassword,
  setNewCustomerPassword,
  handleCreateAccount,
  setScreen,
}: CreateAccountScreenProps) => (
  <>
    <Header title="Create Account" />

    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionText}>
        Create an account to make checkout easier.
      </Text>

      {/* Explains which account registration fields are required */}
      <Text style={{ color: "#555", marginBottom: 10 }}>
        * Indicates a required field
      </Text>

      {/* Displays the Full Name label above the input */}
      <Text style={styles.label}>Customer Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        placeholderTextColor="#555"
        value={newCustomerName}
        onChangeText={setNewCustomerName}
      />

      {/* Displays the Phone Number label above the input */}
      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number *"
        placeholderTextColor="#555"
        value={newCustomerPhone}
        onChangeText={setNewCustomerPhone}
      />

      {/* Displays the Email Address label above the input */}
      <Text style={styles.label}>Email Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address *"
        placeholderTextColor="#555"
        value={newCustomerEmail}
        onChangeText={setNewCustomerEmail}
      />

      {/* Displays the Password label above the input */}
      <Text style={styles.label}>Password *</Text>
      <TextInput
        style={styles.input}
        placeholder="Password *"
        placeholderTextColor="#555"
        secureTextEntry
        value={newCustomerPassword}
        onChangeText={setNewCustomerPassword}
      />

      <Pressable style={styles.primaryButton} onPress={handleCreateAccount}>
        <Text style={styles.primaryButtonText}>Create Account</Text>
      </Pressable>

      <Pressable onPress={() => setScreen("checkout")}>
        <Text style={styles.optionText}>Back to Checkout</Text>
      </Pressable>
    </ScrollView>
  </>
);
