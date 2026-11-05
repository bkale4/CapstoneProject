import { useState } from "react";

// Imports the service for retrieving customer orders from Firestore
import {
    loadAdminOrders as loadAdminOrdersService,
    markOrderAsCancelled as markOrderAsCancelledService,
    markOrderAsFilled as markOrderAsFilledService,
    markOrderAsOpen as markOrderAsOpenService,
    markOrderAsPaid as markOrderAsPaidService,
} from "../services/orderService";

// Manages customer orders displayed in the Business Dashboard
export const useOrders = () => {
  // Stores customer orders retrieved from Firestore
  const [adminOrders, setAdminOrders] = useState<any[]>([]);

  // Loads admin orders through the order service
  const loadAdminOrders = async () => {
    await loadAdminOrdersService(setAdminOrders);
  };

  // Marks an order as filled through the order service
  const markOrderAsFilled = async (orderId: string) => {
    await markOrderAsFilledService(orderId, loadAdminOrders);
  };

  // Confirms an electronic payment and updates the order through the service
  const markOrderAsPaid = async (orderId: string) => {
    await markOrderAsPaidService(orderId, loadAdminOrders);
  };

  // Marks an order as open through the order service
  const markOrderAsOpen = async (orderId: string) => {
    await markOrderAsOpenService(orderId, loadAdminOrders);
  };

  // Marks an order as cancelled through the order service
  const markOrderAsCancelled = async (orderId: string) => {
    await markOrderAsCancelledService(orderId, loadAdminOrders);
  };

  return {
    adminOrders,
    setAdminOrders,
    loadAdminOrders,
    markOrderAsFilled,
    markOrderAsPaid,
    markOrderAsOpen,
    markOrderAsCancelled,
  };
};
