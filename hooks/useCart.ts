import { useEffect, useRef, useState } from "react";

import {
  notifyInactiveMenu,
  notifySoldOutItems,
} from "../utils/cartNotifications";

import type { CartItem, Screen } from "../types/types";

// Manages the customer's shopping cart state
export const useCart = (screen: Screen) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Keeps the latest cart items available for Firestore availability checks
  const cartItemsRef = useRef<CartItem[]>([]);

  // Tracks whether sold-out items were removed so the customer can be notified
  const [soldOutCartNotice, setSoldOutCartNotice] = useState(false);

  // Tracks whether items were removed because a Food Trailer menu became inactive
  const [inactiveMenuCartNotice, setInactiveMenuCartNotice] = useState(false);

  // Tracks the add-ons selected by the customer
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Stores the selected add-on option for each menu item
  const [selectedAddOnOptions, setSelectedAddOnOptions] = useState<{
    [itemId: string]: number;
  }>({});

  // Updates the reference whenever the cart changes
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // Displays the sold-out notification only when sold-out items are removed from the cartthe customer is outsief
  useEffect(() => {
    if (soldOutCartNotice && screen !== "business") {
      notifySoldOutItems();
      setSoldOutCartNotice(false);
    }
  }, [soldOutCartNotice]);

  // Notifies the customer when items are removed because their Food Trailer menu becomes inactive.
  useEffect(() => {
    if (inactiveMenuCartNotice) {
      notifyInactiveMenu();
      setInactiveMenuCartNotice(false);
    }
  }, [inactiveMenuCartNotice]);

  // Adds a new item to the cart or increases its quantity if it already exists
  const addToCart = (
    id: string,
    name: string,
    price: number,
    menuItemId: string,
    menuId: string,
  ) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prev, { id, name, price, quantity: 1, menuItemId, menuId }];
    });
  };

  // Increases the quantity of an existing cart item
  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  // Decreases the quantity of an existing cart item
  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  // Removes the selected item from the cart
  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Removes all items from the customer's cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculates the cart total using each item's price and quantity
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Calculates Maryland's 6% sales tax on the cart subtotal
  const salesTax = Math.round(cartTotal * 0.06 * 100) / 100;

  // Calculates the final order total including sales tax
  const finalTotal = Math.round((cartTotal + salesTax) * 100) / 100;

  return {
    cartItems,
    setCartItems,
    cartItemsRef,
    soldOutCartNotice,
    setSoldOutCartNotice,
    inactiveMenuCartNotice,
    setInactiveMenuCartNotice,
    selectedAddOns,
    setSelectedAddOns,
    selectedAddOnOptions,
    setSelectedAddOnOptions,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    cartTotal,
    salesTax,
    finalTotal,
  };
};
