import { Alert, Platform } from "react-native";

// Notifies customers when a sold-out item is removed from their cart
export const notifySoldOutItems = () => {
  const title = "Item No Longer Available";
  const message =
    "One or more items in your cart have sold out and were automatically removed. Your cart total has been updated.";

  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

// Notices customers when their cart is cleared because a Food Trailer menu becomes inactive
export const notifyInactiveMenu = () => {
  const title = "Menu No Longer Available";
  const message =
    "The Food Trailer menu you were ordering from is no longer available. The items from that menu have been automatically removed from your cart.";

  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};
