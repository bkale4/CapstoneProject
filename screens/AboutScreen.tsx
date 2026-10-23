import React from "react";
import { ScrollView, Text, View } from "react-native";
import { styles } from "../styles/styles";

type AboutScreenProps = {
  Header: ({ title }: { title: string }) => React.JSX.Element;
};

export const AboutScreen = ({ Header }: AboutScreenProps) => (
  <>
    <Header title="About Root & Ranch" />
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About Us</Text>
        <Text style={styles.cardSubtitle}>
          Root & Ranch focuses on food quality and sustainability using locally
          sourced ingredients while also having a positive impact on our
          customers and community with the support of our enthusiastic and
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
