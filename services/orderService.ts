import { collection, getDocs } from "firebase/firestore";
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
