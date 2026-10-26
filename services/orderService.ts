import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import type React from "react";
import { db } from "../firebaseConfig";

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
