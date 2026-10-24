import React, { useEffect, useRef, useState } from "react";

import { styles } from "../../styles/styles";

import type { CartItem, Screen } from "../../types";

import { BusinessLoginScreen } from "../../screens/BusinessScreens";

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
  CateringMenuOptionsScreen as SharedCateringMenuOptionsScreen,
  CateringMenuScreen as SharedCateringMenuScreen,
  CateringRequestScreen as SharedCateringRequestScreen,
  CateringScreen as SharedCateringScreen,
} from "../../screens/CateringScreens";

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
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
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

  const OnsiteEventScreen = () => (
    <>
      <Header title={selectedOnsiteCateringMenu?.name || "Onsite Event Menu"} />
      <ScrollView contentContainerStyle={styles.content}>
        {selectedOnsiteCateringMenu?.eventName && (
          <Text style={styles.sectionText}>
            Current Event: {selectedOnsiteCateringMenu.eventName}
          </Text>
        )}

        {selectedOnsiteCateringMenu?.location && (
          <Text style={styles.sectionText}>
            Location: {selectedOnsiteCateringMenu.location}
          </Text>
        )}

        {selectedOnsiteCateringMenu?.categories?.map(
          (category: any, categoryIndex: number) => (
            <View key={categoryIndex}>
              <Pressable
                style={styles.menuDropdownButton}
                onPress={() =>
                  setExpandedOnsiteCategories((previous) =>
                    previous.includes(categoryIndex)
                      ? previous.filter((index) => index !== categoryIndex)
                      : [...previous, categoryIndex],
                  )
                }
              >
                <Text style={styles.menuDropdownText}>
                  {category.name}{" "}
                  {expandedOnsiteCategories.includes(categoryIndex) ? "▲" : "▼"}
                </Text>
              </Pressable>

              {expandedOnsiteCategories.includes(categoryIndex) &&
                category.items?.map((item: any, itemIndex: number) => (
                  <View key={itemIndex} style={styles.card}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.menuDescription}>
                      {item.description}
                    </Text>
                    {item.pricingType === "halfFull" ? (
                      <>
                        <Text style={styles.cateringPrice}>
                          Half: ${Number(item.halfPrice).toFixed(2)}
                        </Text>
                        <Text style={styles.cateringPrice}>
                          Full: ${Number(item.fullPrice).toFixed(2)}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.cateringPrice}>
                        {item.price === null ||
                        item.price === undefined ||
                        item.price === ""
                          ? "Contact for Pricing"
                          : `${Number(item.price).toFixed(2)}`}
                      </Text>
                    )}

                    {(item.status === "Limited" ||
                      item.status === "Sold Out") && (
                      <Text
                        style={[
                          styles.statusText,
                          item.status === "Sold Out"
                            ? styles.soldOutText
                            : styles.limitedText,
                        ]}
                      >
                        {item.status}
                      </Text>
                    )}
                  </View>
                ))}
            </View>
          ),
        )}
      </ScrollView>
    </>
  );

  const OnsiteEventMenuOptionsScreen = () => (
    <>
      <Header title="Onsite Event Catering Menus" />

      <ScrollView contentContainerStyle={styles.content}>
        {onsiteCateringMenus.map((menu) => (
          <Pressable
            key={menu.id}
            style={styles.menuDropdownButton}
            onPress={() => {
              setSelectedCateringMenuId(menu.id);
              setExpandedOnsiteCategories([]);
              setScreen("onsiteEventCatering");
            }}
          >
            <Text style={styles.menuDropdownText}>{menu.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </>
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

  const CartScreen = () => (
    <>
      <Header title="Cart / Order Review" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Your Order</Text>

          {cartItems.length === 0 ? (
            <Text style={styles.summaryLine}>Your cart is empty.</Text>
          ) : (
            cartItems.map((item) => (
              <View key={item.id} style={styles.cartItemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuName}>{item.name}</Text>
                  <Text style={styles.summaryLine}>
                    ${item.price.toFixed(2)} each
                  </Text>
                  <Text style={styles.summaryLine}>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.quantityControls}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => decreaseQuantity(item.id)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() => increaseQuantity(item.id)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}

          <Text style={styles.summaryTotal}>
            Total: ${cartTotal.toFixed(2)}
          </Text>
        </View>

        <Pressable style={styles.secondaryButton} onPress={clearCart}>
          <Text style={styles.secondaryButtonText}>Clear Cart</Text>
        </Pressable>

        <Pressable
          style={[
            styles.primaryButton,
            cartItems.length === 0 && styles.disabledButton,
          ]}
          onPress={() => {
            if (cartItems.length > 0) setScreen("checkout");
          }}
        >
          <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CustomerLoginScreen = () => (
    <>
      <Header title="Customer Sign In" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionText}>
          Sign in to your customer account.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#555"
          value={customerEmail}
          onChangeText={setCustomerEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry
          value={customerPassword}
          onChangeText={setCustomerPassword}
        />

        <Pressable style={styles.primaryButton} onPress={handleCustomerLogin}>
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </Pressable>

        {customerLoginMessage !== "" && (
          <Text style={styles.sectionText}>{customerLoginMessage}</Text>
        )}

        <Pressable onPress={() => setScreen("checkout")}>
          <Text style={styles.optionText}>Back to Checkout</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CreateAccountScreen = () => (
    <>
      <Header title="Create Account" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionText}>
          Create an account to make checkout easier.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#555"
          value={newCustomerName}
          onChangeText={setNewCustomerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#555"
          value={newCustomerPhone}
          onChangeText={setNewCustomerPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#555"
          value={newCustomerEmail}
          onChangeText={setNewCustomerEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#555"
          secureTextEntry
          value={newCustomerPassword}
          onChangeText={setNewCustomerPassword}
        />

        <Pressable style={styles.primaryButton} onPress={handleCreateAccount}>
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </Pressable>

        <Pressable onPress={() => setScreen("checkout")}>
          <Text style={styles.optionText}>Back to Checkout</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const CheckoutScreen = () => (
    <>
      <Header title="Checkout" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Customer Account</Text>

          {isCustomerLoggedIn ? (
            <View style={[styles.optionButton, styles.selectedOptionButton]}>
              <Text style={styles.sectionText}>
                Signed in to your customer account.
              </Text>

              <Text style={styles.sectionText}>
                Name: {loggedInCustomerName}
              </Text>

              <Text style={styles.sectionText}>
                Phone: {loggedInCustomerPhone}
              </Text>

              <Text style={styles.sectionText}>
                Email: {loggedInCustomerEmail}
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionText}>
                Sign in, create an account, or continue as a guest.
              </Text>

              <Pressable
                style={styles.optionButton}
                onPress={() => setScreen("customerLogin")}
              >
                <Text style={styles.optionText}>Sign In</Text>
              </Pressable>

              <Pressable
                style={styles.optionButton}
                onPress={() => setScreen("createAccount")}
              >
                <Text style={styles.optionText}>Create Account</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.optionButton,
                  continueAsGuest && styles.selectedOptionButton,
                ]}
                onPress={() => setContinueAsGuest(true)}
              >
                <Text style={styles.optionText}>Continue as Guest</Text>
              </Pressable>
            </>
          )}
        </View>

        {continueAsGuest && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#555"
              value={guestName}
              onChangeText={setGuestName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#555"
              value={guestPhone}
              onChangeText={setGuestPhone}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#555"
              value={guestEmail}
              onChangeText={setGuestEmail}
            />
          </>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>

          {["Cash", "Venmo", "PayPal", "Zelle"].map((method) => (
            <Pressable
              key={method}
              style={[
                styles.optionButton,
                paymentMethod === method && styles.selectedOption,
              ]}
              onPress={() => setPaymentMethod(method)}
            >
              <Text
                style={[
                  styles.optionText,
                  paymentMethod === method && styles.selectedOptionText,
                ]}
              >
                {method}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Final Order</Text>
          {cartItems.map((item) => (
            <Text key={item.id} style={styles.summaryLine}>
              {item.name} x {item.quantity} - $
              {(item.price * item.quantity).toFixed(2)}
            </Text>
          ))}
          <Text style={styles.summaryTotal}>
            Total: ${cartTotal.toFixed(2)}
          </Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={submitOrder}>
          <Text style={styles.primaryButtonText}>Place Order</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const OrderConfirmationScreen = () => (
    <>
      <Header title="Order Confirmed" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Thank You!</Text>
          <Text style={styles.summaryLine}>
            Your order has been successfully placed.
          </Text>
          <Text style={styles.summaryLine}>Order Number: #1042</Text>
          <Text style={styles.summaryLine}>
            Estimated Ready Time: 20 minutes
          </Text>
          <Text style={styles.summaryLine}>
            Payment Method: {paymentMethod}
          </Text>
          <Text style={styles.summaryTotal}>
            Total: ${cartTotal.toFixed(2)}
          </Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("home")}
        >
          <Text style={styles.primaryButtonText}>Return Home</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  // Displays the Catering Services screen using the shared component
  const CateringScreen = () => (
    <SharedCateringScreen Header={Header} setScreen={setScreen} />
  );

  const AvailabilityCalendarScreen = () => (
    <>
      <Header title="Catering Availability" />

      <ScrollView contentContainerStyle={styles.content}>
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
            View available dates for catering requests.
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

              const dateForCell = new Date(currentYear, currentMonth, day);

              const todayAtMidnight = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
              );

              const isPastDate = dateForCell < todayAtMidnight;

              const isAvailable =
                !isPastDate && availability[dateKey] !== false;

              const isToday =
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <Pressable
                  key={dateKey}
                  disabled={!isAvailable}
                  onPress={() => setSelectedCateringDate(dateKey)}
                  style={[
                    styles.calendarDay,
                    isAvailable ? styles.availableDay : styles.unavailableDay,
                    isToday && styles.todayDay,
                    selectedCateringDate === dateKey && styles.selectedDay,
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
          <Text style={styles.cardTitle}>Legend</Text>

          <Text style={styles.cardSubtitle}>
            Available = open for catering requests
          </Text>

          <Text style={styles.cardSubtitle}>
            Unavailable = already booked or not accepting requests
          </Text>
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            !selectedCateringDate && styles.disabledButton,
          ]}
          disabled={!selectedCateringDate}
          onPress={() => setScreen("cateringRequest")}
        >
          <Text style={styles.primaryButtonText}>Continue to Request Form</Text>
        </Pressable>
      </ScrollView>
    </>
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

  const CateringConfirmationScreen = () => (
    <>
      <Header title="Request Submitted" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Thank You!</Text>
          <Text style={styles.summaryLine}>
            Your catering request has been submitted successfully.
          </Text>
          <Text style={styles.summaryLine}>
            A member of Root & Ranch Catering will review your request.
          </Text>
          <Text style={styles.summaryLine}>Status: Pending approval</Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setScreen("home")}
        >
          <Text style={styles.primaryButtonText}>Return Home</Text>
        </Pressable>
      </ScrollView>
    </>
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

  const CateringManagementScreen = () => (
    <>
      <Header title="Catering Requests" />
      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Request #C201</Text>
          <Text style={styles.cardSubtitle}>Date: May 21, 2026</Text>
          <Text style={styles.cardSubtitle}>Guests: 45</Text>
          <Text style={styles.cardSubtitle}>
            Menu Preference: Sandwich Platters
          </Text>
          <Text style={styles.cardSubtitle}>Status: Follow Up Needed</Text>
        </View>
      </ScrollView>
    </>
  );

  const MenuManagementScreen = () => (
    <>
      <Header title="Menu Management" />
      <ScrollView contentContainerStyle={styles.content}>
        <BusinessBackButton />

        <Pressable
          style={styles.adminButton}
          onPress={() => setScreen("addMenu")}
        >
          <Text style={styles.adminButtonText}>Add Menu</Text>
        </Pressable>

        {adminMenus.map((menu: any) => (
          <View key={menu.id} style={styles.card}>
            <Text style={styles.cardTitle}>{menu.name}</Text>

            {menu.location && (
              <Text style={styles.cardSubtitle}>Location: {menu.location}</Text>
            )}

            {menu.eventName && (
              <Text style={styles.cardSubtitle}>Event: {menu.eventName}</Text>
            )}

            <Text style={styles.cardSubtitle}>
              Status: {menu.active ? "Active" : "Inactive"}
            </Text>

            <Pressable
              style={styles.adminButton}
              onPress={() => toggleMenuActive(menu.id, menu.active)}
            >
              <Text style={styles.adminButtonText}>
                {menu.active ? "Set Inactive" : "Set Active"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.adminButton}
              onPress={() => {
                setSelectedAdminMenu(menu);
                setEditMenuName(menu.name || "");
                setEditMenuDescription(menu.description || "");
                setEditMenuType(menu.type || "");
                setEditMenuLocation(menu.location || "");
                setEditMenuEventName(menu.eventName || "");
                setScreen("editMenu");
              }}
            >
              <Text style={styles.adminButtonText}>Edit Menu</Text>
            </Pressable>

            <Pressable
              style={styles.adminButton}
              onPress={() => {
                if (Platform.OS === "web") {
                  const confirmed = window.confirm(
                    `Are you sure you want to delete ${menu.name}?`,
                  );

                  if (confirmed) {
                    deleteMenu(menu.id);
                  }
                  return;
                }
                Alert.alert(
                  "Delete Menu",
                  `Are you sure you want to delete "${menu.name}"? This will also delete all its categories and items.`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteMenu(menu.id),
                    },
                  ],
                );
              }}
            >
              <Text style={styles.adminButtonText}>Delete Menu</Text>
            </Pressable>

            <Pressable
              style={styles.adminButton}
              onPress={() => {
                setSelectedAdminMenu(menu);
                setEditMenuDescription(menu.description || "");
                setIsEditingMenuDescription(false);
                setScreen("manageMenuItems");
              }}
            >
              <Text style={styles.adminButtonText}>Manage Items</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </>
  );

  const ManageMenuItemsScreen = () => (
    <>
      <Header title="Manage Menu Items" />

      <ScrollView
        ref={manageMenuScrollRef}
        contentContainerStyle={styles.content}
        onScroll={(event) => {
          setShowBackToTop(event.nativeEvent.contentOffset.y > 20);
        }}
        scrollEventThrottle={16}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => setScreen("menuManagement")}
        >
          <Text style={styles.backButtonText}>🡄 Back</Text>
        </Pressable>

        <Text style={styles.cardTitle}>{selectedAdminMenu?.name}</Text>

        <Text style={styles.label}>Menu Description</Text>

        {isEditingMenuDescription ? (
          <>
            <TextInput
              style={styles.input}
              value={editMenuDescription}
              onChangeText={setEditMenuDescription}
              placeholder="Enter menu description"
              multiline
            />

            <Pressable
              style={styles.adminButton}
              onPress={() => saveMenuDescription()}
            >
              <Text style={styles.adminButtonText}>Save Description</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.menuDescription}>
              {selectedAdminMenu?.description || "No description added."}
            </Text>

            <Pressable
              style={styles.adminButton}
              onPress={() => setIsEditingMenuDescription(true)}
            >
              <Text style={styles.adminButtonText}>Edit Menu Description</Text>
            </Pressable>
          </>
        )}

        <Text style={styles.cardSubtitle}>
          Add, edit, price, and remove menu items.
        </Text>

        <Text style={styles.label}>New Category</Text>

        <TextInput
          style={styles.input}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="Enter category name"
        />

        <TextInput
          style={styles.input}
          value={newCategoryDescription}
          onChangeText={setNewCategoryDescription}
          placeholder="Enter category description (optional)"
          multiline
        />

        <Text style={styles.label}>Parent Category</Text>
        <TextInput
          style={styles.input}
          value={newCategoryParent}
          onChangeText={setNewCategoryParent}
          placeholder="Enter parent category (e.g., Breakfast or Lunch)"
        />

        <Pressable style={styles.adminButton} onPress={addNewCategory}>
          <Text style={styles.adminButtonText}>Add Category</Text>
        </Pressable>

        {getAdminMenuItemGroups(selectedAdminMenu).map((group: any) => (
          <View key={group.field}>
            <Text style={styles.menuSectionTitle}>{group.name}</Text>

            {group.field.startsWith("categories.") &&
            selectedAdminMenu?.categories?.[Number(group.field.split(".")[1])]
              ?.parentCategory ? (
              <Text style={[styles.cardSubtitle, { textAlign: "center" }]}>
                Parent Category:{" "}
                {
                  selectedAdminMenu.categories[
                    Number(group.field.split(".")[1])
                  ].parentCategory
                }
              </Text>
            ) : null}

            {group.field.startsWith("categories.") && (
              <Pressable
                style={styles.adminButton}
                onPress={() => {
                  const categoryIndex = Number(group.field.split(".")[1]);
                  const category =
                    selectedAdminMenu?.categories?.[categoryIndex];
                  setEditingCategoryIndex(categoryIndex);
                  setEditCategoryName(category?.name || "");
                  setEditCategoryDescription(category?.description || "");
                  setEditCategoryParent(category?.parentCategory || "");
                }}
              >
                <Text style={styles.adminButtonText}>Edit Category</Text>
              </Pressable>
            )}

            {group.field.startsWith("categories.") &&
              editingCategoryIndex === Number(group.field.split(".")[1]) && (
                <View style={styles.card}>
                  <Text style={styles.label}>Category Name</Text>
                  <TextInput
                    style={styles.input}
                    value={editCategoryName}
                    onChangeText={setEditCategoryName}
                    placeholder="Category Name"
                  />

                  <Text style={styles.label}>Category Description</Text>
                  <TextInput
                    style={styles.input}
                    value={editCategoryDescription}
                    onChangeText={setEditCategoryDescription}
                    placeholder="Category description (optional)"
                    multiline
                  />

                  <Text style={styles.label}>Parent Category</Text>
                  <TextInput
                    style={styles.input}
                    value={editCategoryParent}
                    onChangeText={setEditCategoryParent}
                    placeholder="Enter parent category (e.g., Breakfast or Lunch"
                  />

                  <Pressable
                    style={styles.adminButton}
                    onPress={() => saveCategoryChanges()}
                  >
                    <Text style={styles.adminButtonText}>Save Changes</Text>
                  </Pressable>
                </View>
              )}

            {group.field.startsWith("categories.") && (
              <Pressable
                style={styles.adminButton}
                onPress={() => {
                  const categoryIndex = Number(group.field.split(".")[1]);

                  if (Platform.OS === "web") {
                    const confirmed = window.confirm(
                      `Are you sure you want to delete ${group.name}?`,
                    );

                    if (confirmed) {
                      deleteMenuCategory(categoryIndex);
                    }

                    return;
                  }
                  Alert.alert(
                    "Delete Menu Item",
                    `Are you sure you want to delete ${group.name}?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteMenuCategory(categoryIndex),
                      },
                    ],
                  );
                }}
              >
                <Text style={styles.adminButtonText}>Delete Category</Text>
              </Pressable>
            )}

            {group.field.startsWith("categories.") && (
              <View style={styles.card}>
                <Text style={styles.label}>Add Item to {group.name}</Text>

                <TextInput
                  style={styles.input}
                  value={
                    newItemCategoryIndex === Number(group.field.split(".")[1])
                      ? newItemName
                      : ""
                  }
                  onChangeText={(text) => {
                    setNewItemCategoryIndex(Number(group.field.split(".")[1]));
                    setNewItemName(text);
                  }}
                  placeholder="Item name"
                />

                {newItemCategoryIndex === Number(group.field.split(".")[1]) && (
                  <>
                    <TextInput
                      style={styles.input}
                      value={newItemDescription}
                      onChangeText={setNewItemDescription}
                      placeholder="Description"
                    />

                    <Text style={styles.label}>Pricing Type</Text>
                    <Pressable
                      style={styles.adminButton}
                      onPress={() =>
                        setNewItemPricingType(
                          newItemPricingType === "single"
                            ? "halfFull"
                            : "single",
                        )
                      }
                    >
                      <Text style={styles.adminButtonText}>
                        {newItemPricingType === "single"
                          ? "Single Price (Tap for Half/Full"
                          : "Half/Full Pricing (Tap for Single)"}
                      </Text>
                    </Pressable>

                    {newItemPricingType === "single" ? (
                      <TextInput
                        style={styles.input}
                        value={newItemPrice}
                        onChangeText={setNewItemPrice}
                        placeholder="Price"
                        keyboardType="decimal-pad"
                      />
                    ) : (
                      <>
                        <TextInput
                          style={styles.input}
                          value={newItemHalfPrice}
                          onChangeText={setNewItemHalfPrice}
                          placeholder="Half Price"
                          keyboardType="decimal-pad"
                        />

                        <TextInput
                          style={styles.input}
                          value={newItemFullPrice}
                          onChangeText={setNewItemFullPrice}
                          placeholder="Full Price"
                          keyboardType="decimal-pad"
                        />
                      </>
                    )}

                    <Text style={styles.label}>Optional Add-on</Text>
                    <TextInput
                      style={styles.input}
                      value={newAddOnName}
                      onChangeText={setNewAddOnName}
                      placeholder="Add-on name (e.g., Bacon or Sausage)"
                    />

                    <TextInput
                      style={styles.input}
                      value={newAddOnPrice}
                      onChangeText={setNewAddOnPrice}
                      placeholder="Add-on price"
                      keyboardType="decimal-pad"
                    />

                    <Pressable
                      style={styles.adminButton}
                      onPress={() =>
                        setAdditionalAddOns((previous) => [
                          ...previous,
                          { name: "", price: "" },
                        ])
                      }
                    >
                      <Text style={styles.adminButtonText}>
                        Add Another Add-on
                      </Text>
                    </Pressable>

                    {additionalAddOns.map((addOn, index) => (
                      <View key={index}>
                        <TextInput
                          style={styles.input}
                          value={addOn.name}
                          onChangeText={(text) =>
                            setAdditionalAddOns((previous) =>
                              previous.map((option, optionIndex) =>
                                optionIndex === index
                                  ? { ...option, name: text }
                                  : option,
                              ),
                            )
                          }
                          placeholder={`Additional add-on ${index + 1} name`}
                        />

                        <TextInput
                          style={styles.input}
                          value={addOn.price}
                          onChangeText={(text) =>
                            setAdditionalAddOns((previous) =>
                              previous.map((option, optionIndex) =>
                                optionIndex === index
                                  ? { ...option, price: text }
                                  : option,
                              ),
                            )
                          }
                          placeholder="Additional add-on price"
                          keyboardType="decimal-pad"
                        />
                      </View>
                    ))}

                    <Pressable
                      style={styles.adminButton}
                      onPress={addNewMenuItem}
                    >
                      <Text style={styles.adminButtonText}>Add Item</Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}

            {group.items.length === 0 ? (
              <Text style={styles.cardSubtitle}>
                No items have been added yet.
              </Text>
            ) : (
              group.items.map((item: any, index: number) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardTitle}>{item.name}</Text>

                  {item.description && (
                    <Text style={styles.cardSubtitle}>{item.description}</Text>
                  )}

                  {item.pricingType === "halfFull" ? (
                    <>
                      <Text style={styles.cardSubtitle}>
                        Half: ${Number(item.halfPrice).toFixed(2)}
                      </Text>
                      <Text style={styles.cardSubtitle}>
                        Full: ${Number(item.fullPrice).toFixed(2)}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.cardSubtitle}>
                      {item.price === null ||
                      item.price === undefined ||
                      item.price === ""
                        ? "Contact for Pricing"
                        : `$${Number(item.price).toFixed(2)}`}
                    </Text>
                  )}

                  {item.addOn && (
                    <Text style={styles.cardSubtitle}>
                      Add-on: {item.addOn.name} (+$
                      {Number(item.addOn.price).toFixed(2)})
                    </Text>
                  )}

                  <Text style={styles.cardSubtitle}>Status: {item.status}</Text>

                  <Pressable
                    style={styles.adminButton}
                    onPress={() => {
                      setSelectedAdminItem(item);
                      setSelectedAdminItemGroup(group.field);
                      setSelectedAdminItemIndex(index);

                      setEditItemName(item.name || "");
                      setEditItemDescription(item.description || "");
                      setEditItemPrice(item.price ?? "");
                      setEditItemPricingType(item.pricingType || "single");
                      setEditItemHalfPrice(
                        item.halfPrice != null ? String(item.halfPrice) : "",
                      );
                      setEditItemFullPrice(
                        item.fullPrice != null ? String(item.fullPrice) : "",
                      );
                      setEditItemStatus(item.status || "");
                      setEditItemAddOnName(item.addOn?.name || "");
                      setEditItemAddOnPrice(
                        item.addOn?.price != null
                          ? String(item.addOn.price)
                          : "",
                      );

                      setScreen("editMenuItem");
                    }}
                  >
                    <Text style={styles.adminButtonText}>Edit Item</Text>
                  </Pressable>

                  <Pressable
                    style={styles.adminButton}
                    onPress={() => {
                      if (Platform.OS === "web") {
                        const confirmed = window.confirm(
                          `Are you sure you want to delete ${item.name}?`,
                        );

                        if (confirmed) {
                          deleteMenuItem(group.field, index);
                        }

                        return;
                      }
                      Alert.alert(
                        "Delete Menu Item",
                        `Are you sure you want to delete ${item.name}?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deleteMenuItem(group.field, index),
                          },
                        ],
                      );
                    }}
                  >
                    <Text style={styles.adminButtonText}>Delete Item</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        ))}
      </ScrollView>

      {showBackToTop && (
        <Pressable
          style={styles.backToTopButton}
          onPress={() =>
            manageMenuScrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            })
          }
        >
          <Text style={styles.backToTopButtonText}>↑ Back to Top</Text>
        </Pressable>
      )}
    </>
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

  const EditMenuItemScreen = () => (
    <>
      <Header title="Edit Menu Item" />

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backButton}
          onPress={() => setScreen("manageMenuItems")}
        >
          <Text style={styles.backButtonText}>🡄 Back</Text>
        </Pressable>

        <Text style={styles.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          value={editItemName}
          onChangeText={setEditItemName}
          placeholder="Enter item name"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={editItemDescription}
          onChangeText={setEditItemDescription}
          placeholder="Enter description"
        />

        <Text style={styles.label}>Pricing Type</Text>
        <Pressable
          style={styles.adminButton}
          onPress={() =>
            setEditItemPricingType(
              editItemPricingType === "single" ? "halfFull" : "single",
            )
          }
        >
          <Text style={styles.adminButtonText}>
            {editItemPricingType === "single"
              ? "Single Price (Tap for Half/Full)"
              : "Half/Full Pricing (Tap for Single)"}
          </Text>
        </Pressable>

        {editItemPricingType === "single" ? (
          <>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={editItemPrice}
              onChangeText={setEditItemPrice}
              placeholder="Enter price"
              keyboardType="decimal-pad"
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>Half Price</Text>
            <TextInput
              style={styles.input}
              value={editItemHalfPrice}
              onChangeText={setEditItemHalfPrice}
              placeholder="Enter half price"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Full Price</Text>
            <TextInput
              style={styles.input}
              value={editItemFullPrice}
              onChangeText={setEditItemFullPrice}
              placeholder="Enter full price"
              keyboardType="decimal-pad"
            />
          </>
        )}

        <Text style={styles.label}>Optional Add-on</Text>
        <TextInput
          style={styles.input}
          value={editItemAddOnName}
          onChangeText={setEditItemAddOnName}
          placeholder="Add-on name"
        />

        <TextInput
          style={styles.input}
          value={editItemAddOnPrice}
          onChangeText={setEditItemAddOnPrice}
          placeholder="Add-on price"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Availability Status</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setItemStatusDropdown(!itemStatusDropdown)}
        >
          <Text style={styles.dropdownText}>
            {editItemStatus || "Select availability status"}
          </Text>

          <Text style={styles.dropdownArrow}>
            {itemStatusDropdown ? "▲" : "▼"}
          </Text>
        </Pressable>

        {itemStatusDropdown && (
          <View style={styles.dropdownOptions}>
            {[
              { label: "Available", value: "Available" },
              { label: "Limited", value: "Limited" },
              { label: "Sold Out", value: "Sold Out" },
            ].map((option) => (
              <Pressable
                key={option.value}
                style={styles.dropdownOption}
                onPress={() => {
                  setEditItemStatus(option.value);
                  setItemStatusDropdown(false);
                }}
              >
                <Text style={styles.dropdownOptionText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable style={styles.adminButton} onPress={saveMenuItemChanges}>
          <Text style={styles.adminButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </>
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

  const AddMenuScreen = () => (
    <>
      <Header title="Add Menu" />

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backButton}
          onPress={() => setScreen("menuManagement")}
        >
          <Text style={styles.backButtonText}>🡄 Back</Text>
        </Pressable>

        <Text style={styles.label}>Menu Name</Text>
        <TextInput
          style={styles.input}
          value={newMenuName}
          onChangeText={setNewMenuName}
          placeholder="Enter menu name"
        />

        <Text style={styles.label}>Menu Description</Text>
        <TextInput
          style={styles.input}
          value={newMenuDescription}
          onChangeText={setNewMenuDescription}
          placeholder="Enter menu description"
          multiline
        />

        <Text style={styles.label}>Menu Type</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setMenuTypeDropdown(!menuTypeDropdown)}
        >
          <Text style={styles.dropdownText}>
            {newMenuType === "foodTrailer"
              ? "Food Trailer"
              : newMenuType === "dropOffCatering"
                ? "Drop-Off Catering"
                : newMenuType === "onsiteEventCatering"
                  ? "Onsite Event Catering"
                  : "Select menu type"}
          </Text>

          <Text style={styles.dropdownArrow}>
            {menuTypeDropdown ? "▲" : "▼"}
          </Text>
        </Pressable>

        {menuTypeDropdown && (
          <View style={styles.dropdownOptions}>
            {["Food Trailer", "Drop-Off Catering", "Onsite Event Catering"].map(
              (type) => (
                <Pressable
                  key={type}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setNewMenuType(
                      type === "Food Trailer"
                        ? "foodTrailer"
                        : type === "Drop-Off Catering"
                          ? "dropOffCatering"
                          : "onsiteEventCatering",
                    );
                    setMenuTypeDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{type}</Text>
                </Pressable>
              ),
            )}
          </View>
        )}

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={newMenuLocation}
          onChangeText={setNewMenuLocation}
          placeholder="Enter location"
        />

        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={newMenuEventName}
          onChangeText={setNewMenuEventName}
          placeholder="Enter event name"
        />

        <Pressable
          style={styles.adminButton}
          onPress={() => setNewMenuActive(!newMenuActive)}
        >
          <Text style={styles.adminButtonText}>
            Status: {newMenuActive ? "Active" : "Inactive"}
          </Text>
        </Pressable>

        <Pressable style={styles.adminButton} onPress={addNewMenu}>
          <Text style={styles.adminButtonText}>Add Menu</Text>
        </Pressable>
      </ScrollView>
    </>
  );

  const EditMenuScreen = () => (
    <>
      <Header title="Edit Menu" />

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.backButton}
          onPress={() => setScreen("menuManagement")}
        >
          <Text style={styles.backButtonText}>🡄 Back</Text>
        </Pressable>

        <Text style={styles.label}>Menu Name</Text>
        <TextInput
          style={styles.input}
          value={editMenuName}
          onChangeText={setEditMenuName}
          placeholder="Enter menu name"
        />

        <Text style={styles.label}>Menu Description</Text>
        <TextInput
          style={styles.input}
          value={editMenuDescription}
          onChangeText={setEditMenuDescription}
          placeholder="Enter menu description"
          multiline
        />

        <Text style={styles.label}>Menu Type</Text>
        <Pressable
          style={styles.dropdown}
          onPress={() => setEditMenuTypeDropdown(!editMenuTypeDropdown)}
        >
          <Text style={styles.dropdownText}>
            {editMenuType === "foodTrailer"
              ? "Food Trailer"
              : editMenuType === "dropOffCatering"
                ? "Drop-Off Catering"
                : editMenuType === "onsiteEventCatering"
                  ? "Onsite Event Catering"
                  : "No menu type selected"}
          </Text>

          <Text style={styles.dropdownArrow}>
            {editMenuTypeDropdown ? "▲" : "▼"}
          </Text>
        </Pressable>

        {editMenuTypeDropdown && (
          <view style={styles.dropdownOptions}>
            {["Food Trailer", "Drop-Off Catering", "Onsite Event Catering"].map(
              (type) => (
                <Pressable
                  key={type}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setEditMenuType(
                      type === "Food Trailer"
                        ? "foodTrailer"
                        : type === "Drop-Off Catering"
                          ? "dropOffCatering"
                          : "onsiteEventCatering",
                    );
                    setEditMenuTypeDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{type}</Text>
                </Pressable>
              ),
            )}
          </view>
        )}

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={editMenuLocation}
          onChangeText={setEditMenuLocation}
          placeholder="Enter location"
        />

        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={editMenuEventName}
          onChangeText={setEditMenuEventName}
          placeholder="Enter event name"
        />

        <Pressable style={styles.adminButton} onPress={saveMenuChanges}>
          <Text style={styles.adminButtonText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </>
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
      {screen === "onsiteEventCatering" && <OnsiteEventScreen />}
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
        <BusinessLoginScreen
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
      {screen === "menuManagement" && <MenuManagementScreen />}
      {screen === "addMenu" && AddMenuScreen()}
      {screen === "editMenu" && EditMenuScreen()}
      {screen === "manageMenuItems" && ManageMenuItemsScreen()}
      {screen === "editMenuItem" && EditMenuItemScreen()}
      {screen === "cateringManagement" && <CateringManagementScreen />}
      <NavBar />
    </SafeAreaView>
  );
}
