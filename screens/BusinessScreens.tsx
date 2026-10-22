import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import type { BusinessLoginScreenProps } from "../types";

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
