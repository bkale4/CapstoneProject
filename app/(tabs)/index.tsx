import React, { useEffect, useRef, useState } from "react";

import { styles } from "../../styles/styles";

import type { CartItem, Screen } from "../../types";

import {
  BusinessLoginScreen as SharedBusinessLoginScreen,
  CreateAccountScreen as SharedCreateAccountScreen,
  CustomerLoginScreen as SharedCustomerLoginScreen,
} from "../../screens/BusinessScreens";

import { Header as SharedHeader } from "../../components/Header";

import { NavBar as SharedNavBar } from "../../components/NavBar";

import { ServiceCard as SharedServiceCard } from "../../components/ServiceCard";

import { MenuItem as SharedMenuItem } from "../../components/MenuItem";

import { HomeScreen as SharedHomeScreen } from "../../screens/HomeScreen";

import { AboutScreen as SharedAboutScreen } from "../../screens/AboutScreen";

// Imports the Order screen component from its separate file
import { OrderScreen as SharedOrderScreen } from "../../screens/OrderScreen";

// Imports the Food Trailer screen from its separate file.
import { FoodTrailerScreen as SharedFoodTrailerScreen } from "../../screens/FoodTrailerScreen";

// Imports the shared Catering Menu Options screen
import {
  AvailabilityCalendarScreen as SharedAvailabilityCalendarScreen,
  CateringConfirmationScreen as SharedCateringConfirmationScreen,
  CateringManagementScreen as SharedCateringManagementScreen,
  CateringMenuOptionsScreen as SharedCateringMenuOptionsScreen,
  CateringMenuScreen as SharedCateringMenuScreen,
  CateringRequestScreen as SharedCateringRequestScreen,
  CateringScreen as SharedCateringScreen,
  OnsiteEventMenuOptionsScreen as SharedOnsiteEventMenuOptionsScreen,
  OnsiteEventScreen as SharedOnsiteEventScreen,
} from "../../screens/CateringScreens";

// Imports the shared Cart screen
import { CartScreen as SharedCartScreen } from "../../screens/CartScreen";

// Imports the Shared Checkout screen
import {
  CheckoutScreen as SharedCheckoutScreen,
  OrderConfirmationScreen as SharedOrderConfirmationScreen,
} from "../../screens/CheckoutScreen";

// Imports the shared Menu Management screen
import {
  AddMenuScreen as SharedAddMenuScreen,
  EditMenuItemScreen as SharedEditMenuItemScreen,
  EditMenuScreen as SharedEditMenuScreen,
  ManageMenuItemsScreen as SharedManageMenuItemsScreen,
  MenuManagementScreen as SharedMenuManagementScreen,
} from "../../screens/MenuManagementScreens";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../firebaseConfig";

import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View
} from "react-native";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [activeFoodTrailerMenu, setActiveFoodTrailerMenu] = useState<any>(null);
  const [foodTrailerLocation, setFoodTrailerLocation] = useState("");
  const [foodTrailerEventName, setFoodTrailerEventName] = useState("");

  const [activeCateringMenu, setActiveCateringMenu] = useState<any[]>([]);
  const [selectedCateringMenuId, setSelectedCateringMenuId] = useState<
    string | null
  >(null);
  const selectedCateringMenu = activeCateringMenu.find(
    (menu) =>
      menu.id === selectedCateringMenuId && menu.type === "dropOffCatering",
  );
  const onsiteCateringMenus = activeCateringMenu.filter(
    (menu) => menu.type === "onsiteEventCatering",
  );

  const selectedOnsiteCateringMenu = onsiteCateringMenus.find(
    (menu) => menu.id === selectedCateringMenuId,
  );

  const dropOffCateringMenus = activeCateringMenu.filter(
    (menu) => menu.type === "dropOffCatering",
  );

  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [expandedParentCategories, setExpandedParentCategories] = useState<
    string[]
  >([]);
  const [expandedOnsiteCategories, setExpandedOnsiteCategories] = useState<
    number[]
  >([]);
  // Tracks which Onsite Event Catering Parent categories are expanded
  const [expandedOnsiteParentCategories, setExpandedOnsiteParentCategories] =
    useState<string[]>([]);
  const [expandedDropOffCategories, setExpandedDropOffCategories] = useState<
    number[]
  >([]);

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedAddOnOptions, setSelectedAddOnOptions] = useState<{
    [itemId: string]: number;
  }>({});

  const [onsiteEventItems, setOnsiteEventItems] = useState<any[]>([]);
  const [onsiteEventLocation, setOnsiteEventLocation] = useState("");
  const [onsiteEventName, setOnsiteEventName] = useState("");
  const [onsiteEventHours, setOnsiteEventHours] = useState("");

  const [selectedMenuType, setSelectedMenuType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");

  const [continueAsGuest, setContinueAsGuest] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPassword, setNewCustomerPassword] = useState("");
  const [createAccountMessage, setCreateAccountMessage] = useState("");
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [customerLoginMessage, setCustomerLoginMessage] = useState("");

  const [loggedInCustomerName, setLoggedInCustomerName] = useState("");
  const [loggedInCustomerPhone, setLoggedInCustomerPhone] = useState("");
  const [loggedInCustomerEmail, setLoggedInCustomerEmail] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const [adminMenus, setAdminMenus] = useState<any>([]);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const manageMenuScrollRef = useRef<ScrollView>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [newMenuName, setNewMenuName] = useState("");
  const [editMenuName, setEditMenuName] = useState("");
  const [newMenuDescription, setNewMenuDescription] = useState("");
  const [editMenuDescription, setEditMenuDescription] = useState("");
  const [isEditingMenuDescription, setIsEditingMenuDescription] =
    useState(false);
  const [newMenuType, setNewMenuType] = useState("");
  const [editMenuType, setEditMenuType] = useState("");
  const [editMenuTypeDropdown, setEditMenuTypeDropdown] = useState(false);
  const [menuTypeDropdown, setMenuTypeDropdown] = useState(false);
  const [newMenuLocation, setNewMenuLocation] = useState("");
  const [editMenuLocation, setEditMenuLocation] = useState("");
  const [newMenuEventName, setNewMenuEventName] = useState("");
  const [editMenuEventName, setEditMenuEventName] = useState("");
  const [newMenuActive, setNewMenuActive] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryParent, setNewCategoryParent] = useState("");
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<
    number | null
  >(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [editCategoryParent, setEditCategoryParent] = useState("");

  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemPricingType, setNewItemPricingType] = useState<
    "single" | "halfFull"
  >("single");
  const [newItemHalfPrice, setNewItemHalfPrice] = useState("");
  const [newItemFullPrice, setNewItemFullPrice] = useState("");
  const [newItemCategoryIndex, setNewItemCategoryIndex] = useState<
    number | null
  >(null);
  const [newAddOnName, setNewAddOnName] = useState("");
  const [newAddOnPrice, setNewAddOnPrice] = useState("");
  const [additionalAddOns, setAdditionalAddOns] = useState<
    { name: string; price: string }[]
  >([]);

  const [selectedAdminMenu, setSelectedAdminMenu] = useState<any>(null);
  const [selectedAdminItem, setSelectedAdminItem] = useState<any>(null);
  const [selectedAdminItemGroup, setSelectedAdminItemGroup] = useState("");
  const [selectedAdminItemIndex, setSelectedAdminItemIndex] = useState<
    number | null
  >(null);

  const [editItemName, setEditItemName] = useState("");
  const [editItemDescription, setEditItemDescription] = useState("");
  const [editItemPrice, setEditItemPrice] = useState("");
  const [editItemPricingType, setEditItemPricingType] = useState<
    "single" | "halfFull"
  >("single");
  const [editItemHalfPrice, setEditItemHalfPrice] = useState("");
  const [editItemFullPrice, setEditItemFullPrice] = useState("");
  const [editItemStatus, setEditItemStatus] = useState("");
  const [editItemAddOnName, setEditItemAddOnName] = useState("");
  const [editItemAddOnPrice, setEditItemAddOnPrice] = useState("");
  const [itemStatusDropdown, setItemStatusDropdown] = useState(false);

  const handleCreateAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newCustomerEmail,
        newCustomerPassword,
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: newCustomerName,
        phone: newCustomerPhone,
        email: newCustomerEmail,
        role: "customer",
      });
      setLoggedInCustomerName(newCustomerName);
      setLoggedInCustomerPhone(newCustomerPhone);
      setLoggedInCustomerEmail(newCustomerEmail);

      setCreateAccountMessage("");
      setIsCustomerLoggedIn(true);
      setScreen("checkout");
    } catch (error) {
      setCreateAccountMessage(
        "Unable to create account. Please check your information.",
      );
    }
  };

  const handleCustomerLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        customerEmail,
        customerPassword,
      );

      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists() && userDoc.data().role === "customer") {
        const customerData = userDoc.data();

        setLoggedInCustomerName(customerData.name || "");
        setLoggedInCustomerPhone(customerData.phone || "");
        setLoggedInCustomerEmail(customerData.email || "");

        setCustomerLoginMessage("");
        setIsCustomerLoggedIn(true);
        setScreen("checkout");
      } else {
        setCustomerLoginMessage(
          "Access Denied. This account is not a customer account.",
        );
      }
    } catch (error) {
      setCustomerLoginMessage("Invalid email or password.");
    }
  };

  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [cateringCustomerName, setCateringCustomerName] = useState("");
  const [selectedCateringDate, setSelectedCateringDate] = useState<string>("");
  const [cateringTime, setCateringTime] = useState("");
  const [cateringGuestCount, setCateringGuestCount] = useState("");
  const [cateringMenuPreferences, setCateringMenuPreferences] = useState("");
  const [cateringContact, setCateringContact] = useState("");
  const [cateringVenueName, setCateringVenueName] = useState("");
  const [cateringVenueAddress, setCateringVenueAddress] = useState("");
  const [cateringNotes, setCateringNotes] = useState("");

  useEffect(() => {
    const loadFoodTrailerMenu = () => {
      try {
        const stopListening = onSnapshot(
          collection(db, "menus"),
          (menuSnapshot) => {
            setActiveFoodTrailerMenu(null);
            setActiveCateringMenu([]);

            menuSnapshot.forEach((menuDoc) => {
              const menuData = menuDoc.data();

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
                setActiveCateringMenu((previous) => [
                  ...previous,
                  {
                    id: menuDoc.id,
                    ...menuData,
                  },
                ]);
              }
            });
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

  useEffect(() => {
    const loadOnsiteEventMenu = async () => {
      try {
        const menuSnapshot = await getDocs(collection(db, "menus"));

        menuSnapshot.forEach((menuDoc) => {
          const menuData = menuDoc.data();

          if (
            menuData.type === "onsiteEventCatering" &&
            menuData.active === true
          ) {
            setOnsiteEventItems(menuData.items || []);
            setOnsiteEventLocation(menuData.location || "");
            setOnsiteEventName(menuData.eventName || "");
            setOnsiteEventHours(menuData.hours || "");
          }
        });
      } catch (error) {
        console.error("Error loading onsite event menu:", error);
      }
    };
    loadOnsiteEventMenu();
  }, []);

  const saveMenuItemChanges = async () => {
    if (!selectedAdminMenu || selectedAdminItemIndex === null) {
      return;
    }

    if (editItemPricingType == "single") {
      if (
        (String(editItemPrice ?? "").trim() === "" && editItemPrice !== null) ||
        !Number.isFinite(Number(editItemPrice)) ||
        Number(editItemPrice) < 0
      ) {
        return;
      }
    } else {
      if (
        !editItemHalfPrice.trim() ||
        !editItemFullPrice.trim() ||
        !Number.isFinite(Number(editItemHalfPrice)) ||
        Number(editItemHalfPrice) < 0 ||
        !Number.isFinite(Number(editItemFullPrice)) ||
        Number(editItemFullPrice) < 0
      ) {
        return;
      }
    }

    const hasAddOn = editItemAddOnName.trim() !== "";
    const addOnPrice = hasAddOn ? Number(editItemAddOnPrice) : 0;

    if (
      (hasAddOn &&
        (!editItemAddOnPrice.trim() ||
          !Number.isFinite(addOnPrice) ||
          addOnPrice < 0)) ||
      (!hasAddOn && editItemAddOnPrice.trim())
    ) {
      return;
    }

    try {
      const isCustomCategory = selectedAdminItemGroup.startsWith("categories.");

      const categoryIndex = isCustomCategory
        ? Number(selectedAdminItemGroup.split(".")[1])
        : -1;
      const updatedItems = isCustomCategory
        ? [...(selectedAdminMenu.categories?.[categoryIndex]?.items || [])]
        : [...(selectedAdminMenu[selectedAdminItemGroup] || [])];

      updatedItems[selectedAdminItemIndex] = {
        ...updatedItems[selectedAdminItemIndex],
        name: editItemName,
        description: editItemDescription,
        pricingType: editItemPricingType,
        ...(editItemPricingType === "single"
          ? {
              price:
                editItemPrice === null || String(editItemPrice).trim() === ""
                  ? null
                  : Number(editItemPrice),
            }
          : {
              halfPrice: Number(editItemHalfPrice),
              fullPrice: Number(editItemFullPrice),
            }),
        status: editItemStatus,
        ...(hasAddOn && {
          addOn: {
            name: editItemAddOnName.trim(),
            price: addOnPrice,
          },
        }),
      };

      if (!hasAddOn) {
        delete updatedItems[selectedAdminItemIndex].addOn;
      }

      if (editItemPricingType === "single") {
        delete updatedItems[selectedAdminItemIndex].halfPrice;
        delete updatedItems[selectedAdminItemIndex].fullPrice;
      } else {
        delete updatedItems[selectedAdminItemIndex].price;
      }

      if (isCustomCategory) {
        const updatedCategories = [...(selectedAdminMenu.categories || [])];

        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          items: updatedItems,
        };

        await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
          categories: updatedCategories,
        });
      } else {
        await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
          [selectedAdminItemGroup]: updatedItems,
        });
      }

      if (isCustomCategory) {
        const updatedCategories = [...(selectedAdminMenu.categories || [])];

        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          items: updatedItems,
        };

        setSelectedAdminMenu({
          ...selectedAdminMenu,
          categories: updatedCategories,
        });
      } else {
        setSelectedAdminMenu({
          ...selectedAdminMenu,
          [selectedAdminItemGroup]: updatedItems,
        });
      }

      await loadAdminMenus();

      setScreen("manageMenuItems");
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const deleteMenuItem = async (groupField: string, itemIndex: number) => {
    const isCustomCategory = groupField.startsWith("categories.");

    const categoryIndex = isCustomCategory
      ? Number(groupField.split(".")[1])
      : -1;

    const updatedItems = isCustomCategory
      ? [...(selectedAdminMenu.categories?.[categoryIndex]?.items || [])]
      : [...(selectedAdminMenu[groupField] || [])];

    updatedItems.splice(itemIndex, 1);

    try {
      if (isCustomCategory) {
        const updatedCategories = [...(selectedAdminMenu.categories || [])];

        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          items: updatedItems,
        };

        await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
          categories: updatedCategories,
        });
      } else {
        await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
          [groupField]: updatedItems,
        });
      }

      if (isCustomCategory) {
        const updatedCategories = [...(selectedAdminMenu.categories || [])];

        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          items: updatedItems,
        };

        setSelectedAdminMenu({
          ...selectedAdminItem,
          categories: updatedCategories,
        });
      } else {
        setSelectedAdminMenu({
          ...selectedAdminMenu,
          [groupField]: updatedItems,
        });
      }

      await loadAdminMenus();
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const loadAdminMenus = async () => {
    try {
      const menuSnapshot = await getDocs(collection(db, "menus"));

      const menus = menuSnapshot.docs.map((menuDoc) => ({
        id: menuDoc.id,
        ...menuDoc.data(),
      }));

      setAdminMenus(menus);
    } catch (error) {
      console.error("Error loading admin menus:", error);
    }
  };

  const loadAdminOrders = async () => {
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

  const markOrderAsFilled = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "Filled",
      });

      await loadAdminOrders();
    } catch (error) {
      console.error("Error marking order as filled:", error);
    }
  };

  const markOrderAsOpen = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "Open",
      });

      await loadAdminOrders();
    } catch (error) {
      console.error("Error marking order as open:", error);
    }
  };

  const markOrderAsCancelled = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "Cancelled",
      });

      await loadAdminOrders();
    } catch (error) {
      console.error("Error marking order as cancelled:", error);
    }
  };

  const isMenuActive = (menuName: string) => {
    const menu = adminMenus.find((menu: any) => menu.name === menuName);

    return menu?.active === true;
  };

  const toggleMenuActive = async (menuId: string, currentActive: boolean) => {
    try {
      const menuRef = doc(db, "menus", menuId);

      const selectedMenu = adminMenus.find((menu: any) => menu.id === menuId);

      if (!selectedMenu) return;

      if (!currentActive && selectedMenu.type === "foodTrailer") {
        const menuSnapshot = await getDocs(collection(db, "menus"));

        for (const menuDoc of menuSnapshot.docs) {
          const menu = menuDoc.data();

          if (
            menuDoc.id !== menuId &&
            menu.type === "foodTrailer" &&
            menu.active === true
          ) {
            await updateDoc(doc(db, "menus", menuDoc.id), {
              active: false,
            });
          }
        }
      }

      await updateDoc(menuRef, {
        active: !currentActive,
      });

      await loadAdminMenus();
    } catch (error) {
      console.error("Error updating menu status:", error);
    }
  };

  const addNewMenu = async () => {
    try {
      await addDoc(collection(db, "menus"), {
        name: newMenuName,
        description: newMenuDescription,
        type: newMenuType,
        location: newMenuLocation,
        eventName: newMenuEventName,
        active: newMenuType === "foodTrailer" ? false : newMenuActive,
        items: [],
        categories: [],
      });

      setNewMenuName("");
      setNewMenuDescription("");
      setNewMenuType("");
      setNewMenuLocation("");
      setNewMenuEventName("");
      setNewMenuActive(true);

      await loadAdminMenus();
      setScreen("menuManagement");
    } catch (error) {
      console.error("Error adding menu:", error);
    }
  };

  const saveCategoryChanges = async () => {
    if (
      !selectedAdminMenu ||
      editingCategoryIndex === null ||
      !editCategoryName.trim()
    ) {
      return;
    }

    try {
      const updatedCategories = [...(selectedAdminMenu.categories || [])];

      updatedCategories[editingCategoryIndex] = {
        ...updatedCategories[editingCategoryIndex],
        name: editCategoryName.trim(),
        description: editCategoryDescription.trim(),
        parentCategory: editCategoryParent.trim(),
      };

      await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
        categories: updatedCategories,
      });

      setSelectedAdminMenu({
        ...selectedAdminMenu,
        categories: updatedCategories,
      });

      setEditingCategoryIndex(null);
      await loadAdminMenus();
    } catch (error) {
      console.error("Error saving category changes:", error);
    }
  };

  const saveMenuDescription = async () => {
    if (!selectedAdminMenu) {
      return;
    }

    try {
      await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
        description: editMenuDescription.trim(),
      });

      setSelectedAdminMenu({
        ...selectedAdminMenu,
        description: editMenuDescription.trim(),
      });

      await loadAdminMenus();
      setIsEditingMenuDescription(false);
    } catch (error) {
      console.error("Error saving menu description:", error);
    }
  };

  const addNewCategory = async () => {
    if (!selectedAdminMenu || !newCategoryName.trim()) {
      return;
    }

    try {
      const updatedCategories = [
        ...(selectedAdminMenu.categories || []),
        {
          name: newCategoryName.trim(),
          description: newCategoryDescription.trim(),
          parentCategory: newCategoryParent.trim(),
          items: [],
        },
      ];

      await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
        categories: updatedCategories,
      });

      setSelectedAdminMenu({
        ...selectedAdminMenu,
        categories: updatedCategories,
      });

      setNewCategoryName("");
      setNewCategoryDescription("");
      setNewCategoryParent("");
      await loadAdminMenus();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const addNewMenuItemAddOn = () => {
    if (!newAddOnName.trim() || !newAddOnPrice.trim()) {
      return;
    }

    const price = Number(newAddOnPrice);

    if (!Number.isFinite(price) || price < 0) {
      return;
    }

    setNewAddOnName("");
    setNewAddOnPrice("");
  };

  const addNewMenuItem = async () => {
    if (
      !selectedAdminMenu ||
      newItemCategoryIndex === null ||
      !newItemName.trim() ||
      (newItemPricingType === "halfFull" &&
        (!newItemHalfPrice.trim() || !newItemFullPrice.trim()))
    ) {
      return;
    }

    const price = Number(newItemPrice);

    const hasAddOn = newAddOnName.trim() !== "";

    const addOnPrice = hasAddOn ? Number(newAddOnPrice) : 0;

    const allAddOns = [
      ...(hasAddOn ? [{ name: newAddOnName.trim(), price: addOnPrice }] : []),
      ...additionalAddOns.map((addOn) => ({
        name: addOn.name.trim(),
        price: Number(addOn.price),
      })),
    ];

    if (
      hasAddOn &&
      (!newAddOnPrice.trim() || !Number.isFinite(addOnPrice) || addOnPrice < 0)
    ) {
      return;
    }

    if (!hasAddOn && newAddOnPrice.trim()) {
      return;
    }

    if (newItemPricingType === "single") {
      if (
        newItemPrice.trim() !== "" &&
        (!Number.isFinite(price) || price < 0)
      ) {
        return;
      }
    } else {
      const halfPrice = Number(newItemHalfPrice);
      const fullPrice = Number(newItemFullPrice);

      if (
        !Number.isFinite(halfPrice) ||
        halfPrice < 0 ||
        !Number.isFinite(fullPrice) ||
        fullPrice < 0
      ) {
        return;
      }
    }

    if (
      additionalAddOns.some(
        (addOn) =>
          !addOn.name.trim() ||
          !addOn.price.trim() ||
          !Number.isFinite(Number(addOn.price)) ||
          Number(addOn.price) < 0,
      )
    ) {
      return;
    }

    try {
      const updatedCategories = [...(selectedAdminMenu.categories || [])];

      const category = updatedCategories[newItemCategoryIndex];

      if (!category) {
        return;
      }

      updatedCategories[newItemCategoryIndex] = {
        ...category,
        items: [
          ...(category.items || []),
          {
            name: newItemName.trim(),
            description: newItemDescription.trim(),
            pricingType: newItemPricingType,
            ...(newItemPricingType === "single"
              ? {
                  price: newItemPrice.trim() === "" ? null : price,
                }
              : {
                  halfPrice: Number(newItemHalfPrice),
                  fullPrice: Number(newItemFullPrice),
                }),
            status: "Available",
            ...(allAddOns.length > 0 && {
              addOns: allAddOns,
              addOn: allAddOns[0],
            }),
          },
        ],
      };

      await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
        categories: updatedCategories,
      });

      setSelectedAdminMenu({
        ...selectedAdminMenu,
        categories: updatedCategories,
      });

      setNewItemName("");
      setNewItemDescription("");
      setNewItemPrice("");
      setNewItemPricingType("single");
      setNewItemHalfPrice("");
      setNewItemFullPrice("");
      setNewAddOnName("");
      setNewAddOnPrice("");
      setAdditionalAddOns([]);
      setNewItemCategoryIndex(null);

      await loadAdminMenus();
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "availability"));

        const savedAvailability: Record<string, boolean> = {};

        querySnapshot.forEach((document) => {
          const data = document.data();

          savedAvailability[document.id] = data.available;
        });
        setAvailability(savedAvailability);
        console.log("Availability loaded from Firebase");
      } catch (error) {
        console.error("Error loading availability:", error);
      }
    };

    loadAvailability();
  }, []);

  const deleteMenu = async (menuId: string) => {
    try {
      await deleteDoc(doc(db, "menus", menuId));
      await loadAdminMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  const toggleAvailability = async (dateKey: string) => {
    const newAvailability = availability[dateKey] === false;

    setAvailability((prev) => ({
      ...prev,
      [dateKey]: newAvailability,
    }));

    try {
      await setDoc(doc(db, "availability", dateKey), {
        date: dateKey,
        available: newAvailability,
      });

      console.log("Availability saved:", dateKey, newAvailability);
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  const submitOrder = async () => {
    const customerName = isCustomerLoggedIn ? loggedInCustomerName : guestName;

    const customerPhone = isCustomerLoggedIn
      ? loggedInCustomerPhone
      : guestPhone;

    const customerEmail = isCustomerLoggedIn
      ? loggedInCustomerEmail
      : guestEmail;

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
        status: "Open",
        createdAt: serverTimestamp(),
      });
      console.log("Order saved to Firebase");
      setScreen("orderConfirmation");
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const submitCateringRequest = async () => {
    try {
      await addDoc(collection(db, "cateringRequests"), {
        customerName: cateringCustomerName,
        contactInformation: cateringContact,
        date: selectedCateringDate,
        time: cateringTime,
        guestCount: Number(cateringGuestCount),
        menuPreferences: cateringMenuPreferences,
        venueName: cateringVenueName,
        venueAddress: cateringVenueAddress,
        specialNotes: cateringNotes,
        status: "pending",
        createdAt: new Date(),
      });

      console.log("Catering request saved to Firebase");

      setScreen("cateringConfirmation");
    } catch (error) {
      console.error("Error saving catering request:", error);
    }
  };

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const goToPreviousMonth = () => {
    if (currentMonth == 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth == 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

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

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

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

  const addToCart = (id: string, name: string, price: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...prev, { id, name, price, quantity: 1 }];
    });
  };

  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleBusinessLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        adminUsername,
        adminPassword,
      );

      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists() && userDoc.data().role === "admin") {
        setLoginMessage("");
        setIsAdminLoggedIn(true);
        setScreen("business");
      } else {
        setLoginMessage("Access Denied. This area is for admin use only.");
      }
    } catch (error) {
      setLoginMessage("Access Denied. Please check your email and passowrd.");
    }
  };

  const BusinessBackButton = () => (
    <Pressable
      style={styles.secondaryButton}
      onPress={() => setScreen("business")}
    >
      <Text style={styles.secondaryButtonText}>Back to Business Dashboard</Text>
    </Pressable>
  );

  const Header = ({ title }: { title: string }) => (
    <SharedHeader title={title} onHomePress={() => setScreen("home")} />
  );

  const NavBar = () => (
    <SharedNavBar setScreen={setScreen} isAdminLoggedIn={isAdminLoggedIn} />
  );

  const ServiceCard = SharedServiceCard;

  const MenuItem = (
    props: Omit<React.ComponentProps<typeof SharedMenuItem>, "addToCart">,
  ) => <SharedMenuItem {...props} addToCart={addToCart} />;

  const HomeScreen = () => (
    <SharedHomeScreen
      Header={Header}
      activeFoodTrailerMenu={activeFoodTrailerMenu}
      foodTrailerLocation={foodTrailerLocation}
      foodTrailerEventName={foodTrailerEventName}
      setSelectedMenuType={setSelectedMenuType}
      setSelectedLocation={setSelectedLocation}
      setSelectedEvent={setSelectedEvent}
      setScreen={setScreen}
    />
  );

  const AboutScreen = () => <SharedAboutScreen Header={Header} />;

  // Connects the Order screen to the application's menu data, navigation, and customer ordering selections
  const OrderScreen = () => (
    <SharedOrderScreen
      Header={Header}
      isMenuActive={isMenuActive}
      foodTrailerLocation={foodTrailerLocation}
      foodTrailerEventName={foodTrailerEventName}
      setSelectedMenuType={setSelectedMenuType}
      setSelectedLocation={setSelectedLocation}
      setSelectedEvent={setSelectedEvent}
      setScreen={setScreen}
    />
  );

  // Connects the Food Trailer screen to the application's menu data, category controls, add-ons, cart, and navigation.
  const FoodTrailerScreen = () => (
    <SharedFoodTrailerScreen
      Header={Header}
      activeFoodTrailerMenu={activeFoodTrailerMenu}
      foodTrailerLocation={foodTrailerLocation}
      foodTrailerEventName={foodTrailerEventName}
      expandedCategories={expandedCategories}
      setExpandedCategories={setExpandedCategories}
      expandedParentCategories={expandedParentCategories}
      setExpandedParentCategories={setExpandedParentCategories}
      selectedAddOns={selectedAddOns}
      setSelectedAddOns={setSelectedAddOns}
      selectedAddOnOptions={selectedAddOnOptions}
      setSelectedAddOnOptions={setSelectedAddOnOptions}
      addToCart={addToCart}
      setScreen={setScreen}
      cartTotal={cartTotal}
    />
  );

  // Gets the parent categories used to organize the Onsite Event Catering menu
  const onsiteParentCategories: string[] = [
    ...new Set<string>(
      (selectedOnsiteCateringMenu?.categories || [])
        .map((category: any) => category.parentCategory?.trim() || "")
        .filter((parent: string) => parent !== ""),
    ),
  ];

  // Displays the Onsite Event Catering screen using the shared component
  const OnsiteEventScreen = () => (
    <SharedOnsiteEventScreen
      Header={Header}
      selectedOnsiteCateringMenu={selectedOnsiteCateringMenu}
      onsiteParentCategories={onsiteParentCategories}
      expandedOnsiteParentCategories={expandedOnsiteParentCategories}
      setExpandedOnsiteParentCategories={setExpandedOnsiteParentCategories}
      expandedOnsiteCategories={expandedOnsiteCategories}
      setExpandedOnsiteCategories={setExpandedOnsiteCategories}
    />
  );

  // Displays the Onsite Event Menu Options screen using the shared component
  const OnsiteEventMenuOptionsScreen = () => (
    <SharedOnsiteEventMenuOptionsScreen
      Header={Header}
      onsiteCateringMenus={onsiteCateringMenus}
      setSelectedCateringMenuId={setSelectedCateringMenuId}
      setExpandedOnsiteCategories={setExpandedOnsiteCategories}
      setScreen={setScreen}
    />
  );

  // Displays the Catering Menu Options screen using the shared component
  const CateringMenuOptionsScreen = () => (
    <SharedCateringMenuOptionsScreen
      Header={Header}
      dropOffCateringMenus={dropOffCateringMenus}
      setSelectedCateringMenuId={setSelectedCateringMenuId}
      setExpandedDropOffCategories={setExpandedDropOffCategories}
      setScreen={setScreen}
    />
  );

  // Displays the Catering Menu screen using the shared component
  const CateringMenuScreen = () => (
    <SharedCateringMenuScreen
      Header={Header}
      selectedCateringMenu={selectedCateringMenu}
      expandedDropOffCategories={expandedDropOffCategories}
      setExpandedDropOffCategories={setExpandedDropOffCategories}
    />
  );

  // Displays the Cart screen using the shared component
  const CartScreen = () => (
    <SharedCartScreen
      Header={Header}
      cartItems={cartItems}
      cartTotal={cartTotal}
      decreaseQuantity={decreaseQuantity}
      increaseQuantity={increaseQuantity}
      removeItem={removeItem}
      clearCart={clearCart}
      setScreen={setScreen}
    />
  );

  const CustomerLoginScreen = () => (
    <SharedCustomerLoginScreen
      Header={Header}
      customerEmail={customerEmail}
      setCustomerEmail={setCustomerEmail}
      customerPassword={customerPassword}
      setCustomerPassword={setCustomerPassword}
      handleCustomerLogin={handleCustomerLogin}
      customerLoginMessage={customerLoginMessage}
      setScreen={setScreen}
    />
  );

  // Displays the Create Account screen using the shared component
  const CreateAccountScreen = () => (
    <SharedCreateAccountScreen
      Header={Header}
      newCustomerName={newCustomerName}
      setNewCustomerName={setNewCustomerName}
      newCustomerPhone={newCustomerPhone}
      setNewCustomerPhone={setNewCustomerPhone}
      newCustomerEmail={newCustomerEmail}
      setNewCustomerEmail={setNewCustomerEmail}
      newCustomerPassword={newCustomerPassword}
      setNewCustomerPassword={setNewCustomerPassword}
      handleCreateAccount={handleCreateAccount}
      setScreen={setScreen}
    />
  );

  // Displays the Checkout screen using the shared component
  const CheckoutScreen = () => (
    <SharedCheckoutScreen
      Header={Header}
      isCustomerLoggedIn={isCustomerLoggedIn}
      loggedInCustomerName={loggedInCustomerName}
      loggedInCustomerPhone={loggedInCustomerPhone}
      loggedInCustomerEmail={loggedInCustomerEmail}
      setScreen={setScreen}
      continueAsGuest={continueAsGuest}
      setContinueAsGuest={setContinueAsGuest}
      guestName={guestName}
      setGuestName={setGuestName}
      guestPhone={guestPhone}
      setGuestPhone={setGuestPhone}
      guestEmail={guestEmail}
      setGuestEmail={setGuestEmail}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      cartItems={cartItems}
      cartTotal={cartTotal}
      submitOrder={submitOrder}
    />
  );

  // Displays the Order Confirmation screen using the shared component
  const OrderConfirmationScreen = () => (
    <SharedOrderConfirmationScreen
      Header={Header}
      paymentMethod={paymentMethod}
      cartTotal={cartTotal}
      setScreen={setScreen}
    />
  );

  // Displays the Catering Services screen using the shared component
  const CateringScreen = () => (
    <SharedCateringScreen Header={Header} setScreen={setScreen} />
  );

  const AvailabilityCalendarScreen = () => (
    <SharedAvailabilityCalendarScreen
      Header={Header}
      currentMonth={currentMonth}
      currentYear={currentYear}
      monthNames={monthNames}
      goToPreviousMonth={goToPreviousMonth}
      goToNextMonth={goToNextMonth}
      firstDayOfMonth={firstDayOfMonth}
      daysInMonth={daysInMonth}
      today={today}
      availability={availability}
      selectedCateringDate={selectedCateringDate}
      setSelectedCateringDate={setSelectedCateringDate}
      setScreen={setScreen}
    />
  );

  // Displays the Catering Request screen using the shared component
  const CateringRequestScreen = () => (
    <SharedCateringRequestScreen
      Header={Header}
      selectedCateringDate={selectedCateringDate}
      formatCateringDate={formatCateringDate}
      cateringCustomerName={cateringCustomerName}
      setCateringCustomerName={setCateringCustomerName}
      cateringTime={cateringTime}
      setCateringTime={setCateringTime}
      cateringGuestCount={cateringGuestCount}
      setCateringGuestCount={setCateringGuestCount}
      cateringMenuPreferences={cateringMenuPreferences}
      setCateringMenuPreferences={setCateringMenuPreferences}
      cateringContact={cateringContact}
      setCateringContact={setCateringContact}
      cateringVenueName={cateringVenueName}
      setCateringVenueName={setCateringVenueName}
      cateringVenueAddress={cateringVenueAddress}
      setCateringVenueAddress={setCateringVenueAddress}
      cateringNotes={cateringNotes}
      setCateringNotes={setCateringNotes}
      submitCateringRequest={submitCateringRequest}
    />
  );

  // Displays the Catering Confirmation screen using the shared component
  const CateringConfirmationScreen = () => (
    <SharedCateringConfirmationScreen Header={Header} setScreen={setScreen} />
  );

  const BusinessScreen = () => (
    <>
      <Header title="Business Dashboard" />
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.card}
          onPress={async () => {
            await loadAdminOrders();
            setScreen("ordersManagement");
          }}
        >
          <Text style={styles.cardTitle}>Incoming Orders</Text>
          <Text style={styles.cardSubtitle}>
            Track food orders and update status.
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => setScreen("cateringManagement")}
        >
          <Text style={styles.cardTitle}>Catering Requests</Text>
          <Text style={styles.cardSubtitle}>
            Review, accept, decline, or follow up.
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={async () => {
            await loadAdminMenus();
            setScreen("menuManagement");
          }}
        >
          <Text style={styles.cardTitle}>Menu Management</Text>
          <Text style={styles.cardSubtitle}>
            Update menus by service context.
          </Text>
        </Pressable>

        <Pressable
          style={styles.card}
          onPress={() => setScreen("availabilityManagement")}
        >
          <Text style={styles.cardTitle}>Availability Management</Text>
          <Text style={styles.cardSubtitle}>Adjust the catering calendar.</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const OrdersManagementScreen = () => (
    <>
      <Header title="Incoming Orders" />

      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />

        {adminOrders.length === 0 ? (
          <Text style={styles.cardSubtitle}>No customer orders found.</Text>
        ) : (
          ["Open", "Filled", "Cancelled"].map((status) => (
            <View key={status}>
              <Text style={styles.menuSectionTitle}>{status} Orders</Text>
              {adminOrders
                .filter((order: any) => order.status === status)
                .map((order: any) => (
                  <View key={order.id} style={styles.card}>
                    <Text style={styles.orderNumberTitle}>
                      Order #{order.id.slice(0, 8)}
                    </Text>

                    <Text style={styles.cardSubtitle}>
                      Customer: {order.customerName}
                    </Text>

                    <Text style={styles.cardSubtitle}>
                      Status: {order.status}
                    </Text>

                    <Text style={styles.cardSubtitle}>
                      Payment Status: {order.paymentStatus}
                    </Text>

                    <Text style={styles.orderedItemsTitle}>Ordered Items:</Text>
                    {order.items?.map((item: any, index: number) => (
                      <Text key={index} style={styles.cardSubtitle}>
                        {item.name} - Quantity: {item.quantity}
                      </Text>
                    ))}

                    {order.status !== "Filled" && (
                      <Pressable
                        style={styles.adminButton}
                        onPress={() => markOrderAsFilled(order.id)}
                      >
                        <Text style={styles.adminButtonText}>
                          Mark as Filled
                        </Text>
                      </Pressable>
                    )}

                    {order.status !== "Open" && (
                      <Pressable
                        style={styles.adminButton}
                        onPress={() => markOrderAsOpen(order.id)}
                      >
                        <Text style={styles.adminButtonText}>Mark as Open</Text>
                      </Pressable>
                    )}

                    {order.status !== "Cancelled" && (
                      <Pressable
                        style={styles.adminButton}
                        onPress={() => markOrderAsCancelled(order.id)}
                      >
                        <Text style={styles.adminButtonText}>
                          Mark as Cancelled
                        </Text>
                      </Pressable>
                    )}
                  </View>
                ))}
            </View>
          ))
        )}
      </ScrollView>
    </>
  );

  // Displays the Catering Management screen using the shared component
  const CateringManagementScreen = () => (
    <SharedCateringManagementScreen
      Header={Header}
      BusinessBackButton={BusinessBackButton}
    />
  );

  // Displays the Menu Management screen using the shared component
  const MenuManagementScreen = () => (
    <SharedMenuManagementScreen
      Header={Header}
      BusinessBackButton={BusinessBackButton}
      adminMenus={adminMenus}
      setScreen={setScreen}
      toggleMenuActive={toggleMenuActive}
      setSelectedAdminMenu={setSelectedAdminMenu}
      setEditMenuName={setEditMenuName}
      setEditMenuDescription={setEditMenuDescription}
      setEditMenuType={setEditMenuType}
      setEditMenuLocation={setEditMenuLocation}
      setEditMenuEventName={setEditMenuEventName}
      setIsEditingMenuDescription={setIsEditingMenuDescription}
      deleteMenu={deleteMenu}
    />
  );

  // Displays the shared Manage Menu Items screen
  const ManageMenuItemsScreen = () => (
    <SharedManageMenuItemsScreen
      Header={Header}
      manageMenuScrollRef={manageMenuScrollRef}
      setShowBackToTop={setShowBackToTop}
      showBackToTop={showBackToTop}
      setScreen={setScreen}
      selectedAdminMenu={selectedAdminMenu}
      isEditingMenuDescription={isEditingMenuDescription}
      editMenuDescription={editMenuDescription}
      setEditMenuDescription={setEditMenuDescription}
      saveMenuDescription={saveMenuDescription}
      setIsEditingMenuDescription={setIsEditingMenuDescription}
      newCategoryName={newCategoryName}
      setNewCategoryName={setNewCategoryName}
      newCategoryDescription={newCategoryDescription}
      setNewCategoryDescription={setNewCategoryDescription}
      newCategoryParent={newCategoryParent}
      setNewCategoryParent={setNewCategoryParent}
      addNewCategory={addNewCategory}
      getAdminMenuItemGroups={getAdminMenuItemGroups}
      editingCategoryIndex={editingCategoryIndex}
      setEditingCategoryIndex={setEditingCategoryIndex}
      editCategoryName={editCategoryName}
      setEditCategoryName={setEditCategoryName}
      editCategoryDescription={editCategoryDescription}
      setEditCategoryDescription={setEditCategoryDescription}
      editCategoryParent={editCategoryParent}
      setEditCategoryParent={setEditCategoryParent}
      saveCategoryChanges={saveCategoryChanges}
      deleteMenuCategory={deleteMenuCategory}
      newItemCategoryIndex={newItemCategoryIndex}
      setNewItemCategoryIndex={setNewItemCategoryIndex}
      newItemName={newItemName}
      setNewItemName={setNewItemName}
      newItemDescription={newItemDescription}
      setNewItemDescription={setNewItemDescription}
      newItemPricingType={newItemPricingType}
      setNewItemPricingType={setNewItemPricingType}
      newItemPrice={newItemPrice}
      setNewItemPrice={setNewItemPrice}
      newItemHalfPrice={newItemHalfPrice}
      setNewItemHalfPrice={setNewItemHalfPrice}
      newItemFullPrice={newItemFullPrice}
      setNewItemFullPrice={setNewItemFullPrice}
      newAddOnName={newAddOnName}
      setNewAddOnName={setNewAddOnName}
      newAddOnPrice={newAddOnPrice}
      setNewAddOnPrice={setNewAddOnPrice}
      additionalAddOns={additionalAddOns}
      setAdditionalAddOns={setAdditionalAddOns}
      addNewMenuItem={addNewMenuItem}
      setSelectedAdminItem={setSelectedAdminItem}
      setSelectedAdminItemGroup={setSelectedAdminItemGroup}
      setSelectedAdminItemIndex={setSelectedAdminItemIndex}
      setEditItemName={setEditItemName}
      setEditItemDescription={setEditItemDescription}
      setEditItemPrice={setEditItemPrice}
      setEditItemPricingType={setEditItemPricingType}
      setEditItemHalfPrice={setEditItemHalfPrice}
      setEditItemFullPrice={setEditItemFullPrice}
      setEditItemStatus={setEditItemStatus}
      setEditItemAddOnName={setEditItemAddOnName}
      setEditItemAddOnPrice={setEditItemAddOnPrice}
      deleteMenuItem={deleteMenuItem}
    />
  );

  const deleteMenuCategory = async (categoryIndex: number) => {
    if (!selectedAdminMenu) {
      return;
    }

    const updatedCategories = [...(selectedAdminMenu.categories || [])];

    updatedCategories.splice(categoryIndex, 1);

    try {
      await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
        categories: updatedCategories,
      });

      setSelectedAdminMenu({
        ...selectedAdminMenu,
        categories: updatedCategories,
      });

      await loadAdminMenus();
    } catch (error) {
      console.error("Error deleting menu category:", error);
    }
  };

  // Displays the shared Edit Menu Item screen
  const EditMenuItemScreen = () => (
    <SharedEditMenuItemScreen
      Header={Header}
      setScreen={setScreen}
      editItemName={editItemName}
      setEditItemName={setEditItemName}
      editItemDescription={editItemDescription}
      setEditItemDescription={setEditItemDescription}
      editItemPricingType={editItemPricingType}
      setEditItemPricingType={setEditItemPricingType}
      editItemPrice={editItemPrice}
      setEditItemPrice={setEditItemPrice}
      editItemHalfPrice={editItemHalfPrice}
      setEditItemHalfPrice={setEditItemHalfPrice}
      editItemFullPrice={editItemFullPrice}
      setEditItemFullPrice={setEditItemFullPrice}
      editItemAddOnName={editItemAddOnName}
      setEditItemAddOnName={setEditItemAddOnName}
      editItemAddOnPrice={editItemAddOnPrice}
      setEditItemAddOnPrice={setEditItemAddOnPrice}
      editItemStatus={editItemStatus}
      setEditItemStatus={setEditItemStatus}
      itemStatusDropdown={itemStatusDropdown}
      setItemStatusDropdown={setItemStatusDropdown}
      saveMenuItemChanges={saveMenuItemChanges}
    />
  );

  const getAdminMenuItemGroups = (menu: any) => {
    if (!menu) {
      return [];
    }

    if (Array.isArray(menu.categories)) {
      return menu.categories.map((category: any, index: number) => ({
        name: category.name,
        field: `categories.${index}.items`,
        items: category.items || [],
      }));
    }

    return [
      {
        name: "Menu Items",
        field: "items",
        items: menu.items || [],
      },
    ];
  };

  const saveMenuChanges = async () => {
    if (!selectedAdminMenu) return;

    try {
      await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
        name: editMenuName,
        description: editMenuDescription,
        type: editMenuType,
        ...(editMenuType !== selectedAdminMenu.type ? { active: false } : {}),
        location: editMenuLocation,
        eventName: editMenuEventName,
      });

      await loadAdminMenus();
      setScreen("menuManagement");
    } catch (error) {
      console.error("Error saving menu changes:", error);
    }
  };

  // Displays the Add Menu screen using the shared component
  const AddMenuScreen = () => (
    <SharedAddMenuScreen
      Header={Header}
      setScreen={setScreen}
      newMenuName={newMenuName}
      setNewMenuName={setNewMenuName}
      newMenuDescription={newMenuDescription}
      setNewMenuDescription={setNewMenuDescription}
      newMenuType={newMenuType}
      setNewMenuType={setNewMenuType}
      menuTypeDropdown={menuTypeDropdown}
      setMenuTypeDropdown={setMenuTypeDropdown}
      newMenuLocation={newMenuLocation}
      setNewMenuLocation={setNewMenuLocation}
      newMenuEventName={newMenuEventName}
      setNewMenuEventName={setNewMenuEventName}
      newMenuActive={newMenuActive}
      setNewMenuActive={setNewMenuActive}
      addNewMenu={addNewMenu}
    />
  );

  // Displays the Edit Menu screen using the shared component
  const EditMenuScreen = () => (
    <SharedEditMenuScreen
      Header={Header}
      setScreen={setScreen}
      editMenuName={editMenuName}
      setEditMenuName={setEditMenuName}
      editMenuDescription={editMenuDescription}
      setEditMenuDescription={setEditMenuDescription}
      editMenuType={editMenuType}
      setEditMenuType={setEditMenuType}
      editMenuTypeDropdown={editMenuTypeDropdown}
      setEditMenuTypeDropdown={setEditMenuTypeDropdown}
      editMenuLocation={editMenuLocation}
      setEditMenuLocation={setEditMenuLocation}
      editMenuEventName={editMenuEventName}
      setEditMenuEventName={setEditMenuEventName}
      saveMenuChanges={saveMenuChanges}
    />
  );

  const AvailabilityManagementScreen = () => (
    <>
      <Header title="Availability Management" />

      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />

        <View style={styles.card}>
          <View style={styles.calendarHeader}>
            <Pressable
              style={styles.calendarNavButton}
              onPress={goToPreviousMonth}
            >
              <Text style={styles.calendarNavText}>‹</Text>
            </Pressable>

            <Text style={styles.cardTitle}>
              {monthNames[currentMonth]} {currentYear}
            </Text>

            <Pressable style={styles.calendarNavButton} onPress={goToNextMonth}>
              <Text style={styles.calendarNavText}>›</Text>
            </Pressable>
          </View>

          <Text style={styles.cardSubtitle}>
            Tap a date to change its availability.
          </Text>
        </View>

        <View style={styles.calendar}>
          <View style={styles.weekRow}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={styles.weekDay}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <View key={`blank-${index}`} style={styles.calendarDay} />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => {
              const day = index + 1;

              const dateKey = `${currentYear}-${String(
                currentMonth + 1,
              ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

              const isAvailable = availability[dateKey] !== false;

              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <Pressable
                  key={dateKey}
                  onPress={() => toggleAvailability(dateKey)}
                  style={[
                    styles.calendarDay,
                    isAvailable ? styles.availableDay : styles.unavailableDay,
                    isToday && styles.todayDay,
                  ]}
                >
                  <Text style={styles.calendarDayNumber}>{day}</Text>

                  <Text style={styles.calendarStatus}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How It Works</Text>

          <Text style={styles.cardSubtitle}>
            Tap an available date to mark it unavailable.
          </Text>

          <Text style={styles.cardSubtitle}>
            Tap an unavailable date to make it available again.
          </Text>
        </View>
      </ScrollView>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {screen === "home" && <HomeScreen />}
      {screen === "about" && <AboutScreen />}
      {screen === "order" && <OrderScreen />}
      {screen === "foodTrailer" && FoodTrailerScreen()}
      {screen === "onsiteEventCatering" && OnsiteEventScreen()}
      {screen === "onsiteEventMenuOptions" && OnsiteEventMenuOptionsScreen()}
      {screen === "cart" && <CartScreen />}
      {screen === "checkout" && CheckoutScreen()}
      {screen === "customerLogin" && CustomerLoginScreen()}
      {screen === "createAccount" && CreateAccountScreen()}
      {screen === "orderConfirmation" && <OrderConfirmationScreen />}
      {screen === "catering" && <CateringScreen />}
      {screen === "cateringMenuOptions" && CateringMenuOptionsScreen()}
      {screen === "cateringMenu" && CateringMenuScreen()}
      {screen === "availabilityCalendar" && <AvailabilityCalendarScreen />}
      {screen === "cateringRequest" && CateringRequestScreen()}
      {screen === "cateringConfirmation" && <CateringConfirmationScreen />}
      {screen === "businessLogin" && (
        <SharedBusinessLoginScreen
          Header={Header}
          styles={styles}
          adminUsername={adminUsername}
          setAdminUsername={setAdminUsername}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          handleBusinessLogin={handleBusinessLogin}
          loginMessage={loginMessage}
        />
      )}
      {screen === "business" && <BusinessScreen />}
      {screen === "ordersManagement" && <OrdersManagementScreen />}
      {screen === "availabilityManagement" && <AvailabilityManagementScreen />}
      {screen === "menuManagement" && MenuManagementScreen()}
      {screen === "addMenu" && AddMenuScreen()}
      {screen === "editMenu" && EditMenuScreen()}
      {screen === "manageMenuItems" && ManageMenuItemsScreen()}
      {screen === "editMenuItem" && EditMenuItemScreen()}
      {screen === "cateringManagement" && <CateringManagementScreen />}
      <NavBar />
    </SafeAreaView>
  );
}
