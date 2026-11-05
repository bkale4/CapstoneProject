import { useState } from "react";

// Imports the hook for managing catering calendar navigation and dates

// Manages calendar navigation, displayed dates, and date formatting
export const useCalendar = () => {
  // Gets the current date to initialize the calendar
  const today = new Date();

  // Tracks the month and year currently displayed
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Navigates to the previous month and adjusts the year when necessary
  const goToPreviousMonth = () => {
    if (currentMonth == 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  // Navigates to the next month and adjusts the year when necessary
  const goToNextMonth = () => {
    if (currentMonth == 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Stores the month names displayed in the calendar
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

  // Calculates the number of days in the displayed month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Determines which weekday the displayed month begins on
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Formats a selected catering date into a readable date
  const formatCateringDate = (dateKey: string) => {
    if (!dateKey) return "";
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return {
    today,
    currentMonth,
    currentYear,
    goToPreviousMonth,
    goToNextMonth,
    monthNames,
    daysInMonth,
    firstDayOfMonth,
    formatCateringDate,
  };
};
