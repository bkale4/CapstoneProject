import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import type React from "react";
import { db } from "../firebaseConfig";

import type { CartItem, Screen } from "../types";

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
  paymentMethod: string,
  setScreen: (screen: Screen) => void,
) => {
  try {
    await addDoc(collection(db, "orders"), {
      customerName: customerName,
      phone: customerPhone,
      email: customerEmail,
      menuType: selectedMenuType,
      location: selectedLocation,
      eventName: selectedEvent,
      items: cartItems,
      total: cartTotal,
      paymentMethod: paymentMethod,
      paymentStatus: "Not Paid",
      status:
        paymentMethod.toLowerCase() === "cash" ? "Open" : "Pending Payment",
      createdAt: serverTimestamp(),
    });

    console.log("Order saved to Firebase");
    setScreen("orderConfirmation");
  } catch (error) {
    console.error("Error saving order:", error);
  }
};
