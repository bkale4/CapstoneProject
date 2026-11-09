import { useState } from "react";

import type { Dispatch, SetStateAction } from "react";

import { Linking } from "react-native";

import { submitOrder as submitOrderService } from "../services/orderService";

import { CUSTOMER_PAYMENT_LINKS } from "../constants/paymentLinks";

import type { CartItem, Screen } from "../types/types";

// Imports the service for submitting customer orders

// Imports the configured customer payment destinations

// Defines the customer, cart, menu, and navigation information needed for checkout
interface UseCheckoutOptions {
  isCustomerLoggedIn: boolean;
  loggedInCustomerName: string;
  loggedInCustomerPhone: string;
  loggedInCustomerEmail: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  selectedMenuType: string;
  selectedLocation: string;
  selectedEvent: string;
  cartItems: CartItem[];
  cartTotal: number;
  salesTax: number;
  finalTotal: number;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  setScreen: Dispatch<SetStateAction<Screen>>;
}

// Manages checkout and order confirmation state
export const useCheckout = ({
  isCustomerLoggedIn,
  loggedInCustomerName,
  loggedInCustomerPhone,
  loggedInCustomerEmail,
  guestName,
  guestPhone,
  guestEmail,
  selectedMenuType,
  selectedLocation,
  selectedEvent,
  cartItems,
  cartTotal,
  salesTax,
  finalTotal,
  setCartItems,
  setScreen,
}: UseCheckoutOptions) => {
  // Stores the total of the most recently submitted order for the confirmation screen
  const [confirmedOrderTotal, setConfirmedOrderTotal] = useState(0);

  // Stores the Firestore ID of the most recently submitted order
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  // Tracks whether an order is being submitted to prevent duplicate submissions
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Passes the customer order information to the order service
  const submitOrder = async () => {
    // Prevents another submission while an order is already being saved
    if (isSubmittingOrder) {
      return;
    }
    // Marks the order as being submitted
    setIsSubmittingOrder(true);
    const customerName = isCustomerLoggedIn ? loggedInCustomerName : guestName;

    const customerPhone = isCustomerLoggedIn
      ? loggedInCustomerPhone
      : guestPhone;

    const customerEmail = isCustomerLoggedIn
      ? loggedInCustomerEmail
      : guestEmail;

    // Tracks whether the order was successfully saved before opening payment
    const orderSaved = await submitOrderService(
      customerName,
      customerPhone,
      customerEmail,
      selectedMenuType,
      selectedLocation,
      selectedEvent,
      cartItems,
      cartTotal,
      salesTax,
      finalTotal,
      processingFeePayPal,
      checkoutTotal,
      paymentMethod,
      setScreen,
    );

    // Allows another submission once Firestore finishes saving the order
    setIsSubmittingOrder(false);

    // Stops checkout if the order could not be saved to Firestore
    if (!orderSaved) {
      return;
    }

    // Saves the successful order's ID for the confirmation screen
    setConfirmedOrderId(orderSaved);

    // Preserves the calculated checkout total before clearing the cart
    setConfirmedOrderTotal(checkoutTotal);

    // Clears the customer's cart only after the order saves successfully
    setCartItems([]);

    // Identifies the selected electronic payment method
    const selectedPaymentLink =
      CUSTOMER_PAYMENT_LINKS[
        paymentMethod.toLowerCase() as keyof typeof CUSTOMER_PAYMENT_LINKS
      ];

    // Opens the selected payment service after the order is saved
    if (selectedPaymentLink) {
      try {
        await Linking.openURL(selectedPaymentLink);
      } catch (error) {
        // Keeps the saved order intact if the payment link cannot be opened
        console.error("Unable to open payment service:", error);
      }
    }
  };

  // Calculates a 3.5% processing fee for PayPal payments
  const calculatePayPalFee = (amount: number) => {
    return Math.round(amount * 0.035 * 100) / 100;
  };

  // Tracks the payment method selected by the customer during checkout
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Calculates a 3.5% processing for PayPal orders only
  const processingFeePayPal =
    paymentMethod === "PayPal" ? calculatePayPalFee(finalTotal) : 0;

  // Calculate the total including sales tax and any processing fee
  const checkoutTotal =
    Math.round((finalTotal + processingFeePayPal) * 100) / 100;

  return {
    confirmedOrderTotal,
    setConfirmedOrderTotal,
    confirmedOrderId,
    setConfirmedOrderId,
    isSubmittingOrder,
    setIsSubmittingOrder,
    submitOrder,
    paymentMethod,
    setPaymentMethod,
    processingFeePayPal,
    checkoutTotal,
  };
};
