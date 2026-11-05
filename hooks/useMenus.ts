import { useEffect, useState } from "react";

import type { Dispatch, RefObject, SetStateAction } from "react";

import type { CartItem } from "../types/index";

// Imports Firestore functions for listening to real-time menu updates
import { collection, onSnapshot } from "firebase/firestore";

// Imports the application's Firebase database connection
import { db } from "../firebaseConfig";

// Defines the cart information and notification controls needed by the menu listener
interface UseMenusOptions {
  cartItemsRef: RefObject<CartItem[]>;
  setCartItems: Dispatch<SetStateAction<CartItem[]>>;
  setSoldOutCartNotice: Dispatch<SetStateAction<boolean>>;
  setInactiveMenuCartNotice: Dispatch<SetStateAction<boolean>>;
}

// Manages menu information displayed to customers
export const useMenus = ({
  cartItemsRef,
  setCartItems,
  setSoldOutCartNotice,
  setInactiveMenuCartNotice,
}: UseMenusOptions) => {
  // Stores the currently active Food Trailer menu
  const [activeFoodTrailerMenu, setActiveFoodTrailerMenu] = useState<any>(null);

  // Stores the active Food Trailer menu's location and event information
  const [foodTrailerLocation, setFoodTrailerLocation] = useState("");
  const [foodTrailerEventName, setFoodTrailerEventName] = useState("");

  // Stores active catering menus and tracks the customer's selected menu
  const [activeCateringMenus, setActiveCateringMenus] = useState<any[]>([]);

  // Tracks the catering menu selected by the customer
  const [selectedCateringMenuId, setSelectedCateringMenuId] = useState<
    string | null
  >(null);

  // Filters active Drop-Off Catering menus
  const dropOffCateringMenus = activeCateringMenus.filter(
    (menu) => menu.type === "dropOffCatering",
  );

  // Finds the selected Drop-Off Catering menu
  const selectedDropOffCateringMenu = activeCateringMenus.find(
    (menu) =>
      menu.id === selectedCateringMenuId && menu.type === "dropOffCatering",
  );

  // Filters active Onsite Event Catering menus
  const onsiteCateringMenus = activeCateringMenus.filter(
    (menu) => menu.type === "onsiteEventCatering",
  );

  // Finds the selected Onsite Event Catering menu
  const selectedOnsiteCateringMenu = onsiteCateringMenus.find(
    (menu) => menu.id === selectedCateringMenuId,
  );

  // Tracks the type of menu selected for customer ordering
  const [selectedMenuType, setSelectedMenuType] = useState("");

  // Stores the location associated with the selected menu
  const [selectedLocation, setSelectedLocation] = useState("");

  // Stores the event associated with the selected menu
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    const loadFoodTrailerMenu = () => {
      try {
        const stopListening = onSnapshot(
          collection(db, "menus"),
          (menuSnapshot) => {
            setActiveFoodTrailerMenu(null);
            setActiveCateringMenus([]);

            // Stores the IDs of menu items currently marked as Sold Out
            const soldOutItemIds = new Set<string>();

            // Stores the IDs of Food Trailer menus that are currrently inactive
            const inactiveFoodTrailerMenuIds = new Set<string>();

            menuSnapshot.forEach((menuDoc) => {
              const menuData = menuDoc.data();

              // Tracks Food Trailer menus that have been marked inactibve
              if (
                menuData.type === "foodTrailer" &&
                menuData.active === false
              ) {
                inactiveFoodTrailerMenuIds.add(menuDoc.id);
              }

              // Checks each menu category for sold-out items
              menuData.categories?.forEach((category: any) => {
                category.items?.forEach((item: any) => {
                  if (item.status === "Sold Out" && item.id) {
                    soldOutItemIds.add(`${menuDoc.id}:${item.id}`);
                  }
                });
              });

              if (menuData.type === "foodTrailer" && menuData.active === true) {
                setActiveFoodTrailerMenu({
                  id: menuDoc.id,
                  ...menuData,
                });
                console.log(
                  "Active Food Trailer menu:",
                  menuData.name,
                  menuData.categories,
                );
                setFoodTrailerLocation(menuData.location || "");
                setFoodTrailerEventName(menuData.eventName || "");
              }

              if (
                (menuData.type === "dropOffCatering" ||
                  menuData.type === "onsiteEventCatering") &&
                menuData.active === true
              ) {
                setActiveCateringMenus((previous) => [
                  ...previous,
                  {
                    id: menuDoc.id,
                    ...menuData,
                  },
                ]);
              }
            });

            // Checks whether the current cart contains any sold-out items
            const hasSoldOutCartItems = cartItemsRef.current.some((cartItem) =>
              soldOutItemIds.has(`${cartItem.menuId}:${cartItem.menuItemId}`),
            );

            // Checks whether the cart contains items from an inactive Food Trailer menu.
            const hasInactiveMenuCartItems = cartItemsRef.current.some(
              (cartItem) => inactiveFoodTrailerMenuIds.has(cartItem.menuId),
            );

            // Triggers a customer notification when inactive menu items are detected.
            if (hasInactiveMenuCartItems) {
              setInactiveMenuCartNotice(true);
            }

            // Triggers a customer notificaiton when sold-out items are detected
            if (hasSoldOutCartItems) {
              setSoldOutCartNotice(true);
            }

            // Removes cart items that have become sold out or belong to an inactive Food Trailer menu
            setCartItems((previous) =>
              previous.filter(
                (cartItem) =>
                  !soldOutItemIds.has(
                    `${cartItem.menuId}:${cartItem.menuItemId}`,
                  ) && !inactiveFoodTrailerMenuIds.has(cartItem.menuId),
              ),
            );
          },
        );

        return stopListening;
      } catch (error) {
        console.error("Error loading food trailer menu:", error);
      }
    };

    const stopListening = loadFoodTrailerMenu();

    return () => {
      stopListening?.();
    };
  }, []);

  return {
    activeFoodTrailerMenu,
    setActiveFoodTrailerMenu,
    foodTrailerLocation,
    setFoodTrailerLocation,
    foodTrailerEventName,
    setFoodTrailerEventName,
    activeCateringMenus,
    setActiveCateringMenus,
    selectedCateringMenuId,
    setSelectedCateringMenuId,
    selectedDropOffCateringMenu,
    onsiteCateringMenus,
    selectedOnsiteCateringMenu,
    dropOffCateringMenus,
    selectedMenuType,
    setSelectedMenuType,
    selectedLocation,
    setSelectedLocation,
    selectedEvent,
    setSelectedEvent,
  };
};
