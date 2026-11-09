// Imports React and components for displaying the availability calendar
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

// Imports shared application styles
import { styles } from "../styles/styles";

// Imports the properties required by the Availability Management screen
import type { AvailabilityManagementScreenProps } from "../types/types";

// Displays the calendar and allows the client to manage available dates
export const AvailabilityManagementScreen = ({
  Header,
  BusinessBackButton,
  currentMonth,
  currentYear,
  monthNames,
  goToPreviousMonth,
  goToNextMonth,
  firstDayOfMonth,
  daysInMonth,
  today,
  availability,
  toggleAvailability,
}: AvailabilityManagementScreenProps) => (
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

            const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(
              2,
              "0",
            )}-${String(day).padStart(2, "0")}`;

            const dateForCell = new Date(currentYear, currentMonth, day);

            const todayAtMidnight = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
            );

            const isPastDate = dateForCell < todayAtMidnight;

            const isAvailable = !isPastDate && availability[dateKey] !== false;

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
