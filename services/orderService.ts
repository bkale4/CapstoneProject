import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import type React from "react";

import { Alert, Platform } from "react-native";

import { db } from "../firebaseConfig";

import type { CartItem, Screen } from "../types/types";

// Loads customer orders from Firestore for the Admin dashboard
export const loadAdminOrders = async (
  setAdminOrders: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    const snapshot = await getDocs(collection(db, "orders"));

    const orders = snapshot.docs.map((orderDoc) => ({
      id: orderDoc.id,
      ...orderDoc.data(),
    }));

    setAdminOrders(orders);
  } catch (error) {
    console.error("Error loading customer orders:", error);
  }
};

// Marks an order as filled and refreshes the order list
export const markOrderAsFilled = async (
  orderId: string,
  loadAdminOrders: () => Promise<void>,
) => {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      status: "Filled",
    });

    await loadAdminOrders();
  } catch (error) {
    console.error("Error marking order as filled:", error);
  }
};

// Marks a verified electronic payment as Paid and releases the order for preparation
export const markOrderAsPaid = async (
  orderId: string,
  loadAdminOrders: () => Promise<void>,
) => {
  try {
    // Updates both statuses together in a single Firestore operation
    await updateDoc(doc(db, "orders", orderId), {
      paymentStatus: "Paid",
      status: "Open",
    });

    // Refreshes Incoming Orders to display the updated order
    await loadAdminOrders();
  } catch (error) {
    console.error("Error marking order as paid:", error);
    throw error;
  }
};

// Marks an order as open and refreshes the order list
export const markOrderAsOpen = async (
  orderId: string,
  loadAdminOrders: () => Promise<void>,
) => {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      status: "Open",
    });

    await loadAdminOrders();
  } catch (error) {
    console.error("Error marking order as open:", error);
  }
};

// Marks an order as cancelled and refreshes the order list
export const markOrderAsCancelled = async (
  orderId: string,
  loadAdminOrders: () => Promise<void>,
) => {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      status: "Cancelled",
    });

    await loadAdminOrders();
  } catch (error) {
    console.error("Error marking order as cancelled:", error);
  }
};

// Saves a customer order to Firestore
export const submitOrder = async (
  customerName: string,
  customerPhone: string,
  customerEmail: string,
  selectedMenuType: string,
  selectedLocation: string,
  selectedEvent: string,
  cartItems: CartItem[],
  cartTotal: number,
  salesTax: number,
  finalTotal: number,
  processingFeePayPal: number,
  checkoutTotal: number,
  paymentMethod: string,
  setScreen: (screen: Screen) => void,
) => {
  try {
    // Checks that each cart item's menu and availability are still valid
    for (const cartItem of cartItems) {
      const menuRef = doc(db, "menus", cartItem.menuId);
      const menuSnapshot = await getDoc(menuRef);

      // Prevents ordering from menus that no longer exist or are inactive
      if (!menuSnapshot.exists() || menuSnapshot.data().active !== true) {
        throw new Error(`${cartItem.name} is no longer available.`);
      }

      const menuData = menuSnapshot.data();

      // Finds the original item within the menu's categories
      const menuItem = menuData.categories
        ?.flatMap((category: any) => category.items || [])
        .find((item: any) => item.id === cartItem.menuItemId);

      // Prevents deleted or sold-out items from being ordered
      if (!menuItem || menuItem.status === "Sold Out") {
        throw new Error(`${cartItem.name} is no longer available.`);
      }
    }

    const orderDoc = await addDoc(collection(db, "orders"), {
      customerName: customerName,
      phone: customerPhone,
      email: customerEmail,
      menuType: selectedMenuType,
      location: selectedLocation,
      eventName: selectedEvent,
      items: cartItems,
      subtotal: cartTotal,
      salesTax: salesTax,
      processingFeePayPal: processingFeePayPal,
      total: checkoutTotal,
      paymentMethod: paymentMethod,
      paymentStatus: "Not Paid",
      status:
        paymentMethod.toLowerCase() === "cash" ? "Open" : "Pending Payment",
      createdAt: serverTimestamp(),
    });

    // Stores the generated order ID for use on the confirmation screen
    const orderId = orderDoc.id;

    console.log("Order saved to Firebase");
    setScreen("orderConfirmation");

    // Confirms that the order was successfully saved to Firestore
    return orderId;
  } catch (error) {
    console.error("Error saving order:", error);

    // Displays the reason checkout failed to the customer
    const message =
      error instanceof Error
        ? error.message
        : "Your order could not be submitted. Please try again.";

    if (Platform.OS === "web") {
      window.alert(`Order Not Submitted\n\n${message}`);
    } else {
      Alert.alert("Order Not Submitted", message);
    }

    // Prevents payment from continuing when the order is not saved
    return false;
  }
};
