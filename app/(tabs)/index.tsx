import React, { useEffect, useRef, useState } from "react";

// Imports SafeAreaView for handling screen safe areas
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../../styles/styles";

import type { CartItem, Screen } from "../../types";

import {
  BusinessLoginScreen as SharedBusinessLoginScreen,
  CreateAccountScreen as SharedCreateAccountScreen,
  CustomerLoginScreen as SharedCustomerLoginScreen,
} from "../../screens/AuthenticationScreens";

import { Header as SharedHeader } from "../../components/Header";

import { NavBar as SharedNavBar } from "../../components/NavBar";

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
  CateringEventsScreen as SharedCateringEventsScreen,
  CateringManagementScreen as SharedCateringManagementScreen,
  DropOffCateringMenuOptionsScreen as SharedCateringMenuOptionsScreen,
  CateringRequestScreen as SharedCateringRequestScreen,
  CateringScreen as SharedCateringScreen,
  DropOffCateringMenuScreen as SharedDropOffCateringMenuScreen,
  OnsiteCateringMenuOptionsScreen as SharedOnsiteCateringMenuOptionsScreen,
  OnsiteCateringMenuScreen as SharedOnsiteCateringMenuScreen,
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

// Imports the Payment Management screen for administrator access
import { PaymentManagementScreen } from "../../screens/PaymentManagementScreen";

// Imports the shared Orders Management screen
import { OrdersManagementScreen as SharedOrdersManagementScreen } from "../../screens/OrdersManagementScreen";

// Imports the shared Availability Management screen
import { AvailabilityManagementScreen as SharedAvailabilityManagementScreen } from "../../screens/AvailabilityManagementScreen";

// Imports the Business Dashboard screen
import { BusinessDashboardScreen } from "../../screens/BusinessDashBoardScreen";

// Imports the service for creating menus in Firestore
import {
  addNewCategory as addNewCategoryService,
  addNewMenuItem as addNewMenuItemService,
  createMenu,
  deleteMenuCategory as deleteMenuCategoryService,
  deleteMenuItem as deleteMenuItemService,
  loadAdminMenusService,
  saveCategoryChanges as saveCategoryChangesService,
  saveMenuChanges as saveMenuChangesService,
  saveMenuDescription as saveMenuDescriptionService,
  saveMenuItemChanges as saveMenuItemChangesService,
  toggleMenuActive as toggleMenuActiveService,
} from "../../services/menuService";

// Imports the function for loading customer orders
import {
  loadAdminOrders as loadAdminOrdersService,
  markOrderAsCancelled as markOrderAsCancelledService,
  markOrderAsFilled as markOrderAsFilledService,
  markOrderAsOpen as markOrderAsOpenService,
  markOrderAsPaid as markOrderAsPaidService,
  submitOrder as submitOrderService,
} from "../../services/orderService";

// Imports the catering request submission service
import {
  loadAvailability,
  loadAvailability as loadAvailabilityService,
  loadCateringRequests as loadCateringRequestsService,
  submitCateringRequest as submitCateringRequestService,
  toggleAvailability as toggleAvailabilityService,
  updateCateringFollowUp as updateCateringFollowUpService,
  updateCateringRequestStatus as updateCateringRequestStatusService,
} from "../../services/cateringService";

// Imports the customer account creation service
import {
  handleBusinessLogin as handleBusinessLoginService,
  handleCreateAccount as handleCreateAccountService,
  handleCustomerLogin as handleCustomerLoginService,
} from "../../services/authService";

import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";

import { db } from "../../firebaseConfig";

import { Linking, Pressable, ScrollView, Text } from "react-native";

// Stores customer payment destinations until the client's account details are available
const CUSTOMER_PAYMENT_LINKS = {
  venmo: "",
  paypal: "",
  zelle: "",
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Stores the total of the most recently submitted order for the confirmation screen
  const [confirmedOrderTotal, setConfirmedOrderTotal] = useState(0);
  // Stores the Firestore ID of the most recently submitted order
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

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

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedAddOnOptions, setSelectedAddOnOptions] = useState<{
    [itemId: string]: number;
  }>({});

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

  // Stores customer catering requests retrieved from Firestore
  const [cateringRequests, setCateringRequests] = useState<any[]>([]);

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
  const [newItemPhoto, setNewItemPhoto] = useState<string | null>(null);
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
  const [editItemPhoto, setEditItemPhoto] = useState<string | null>(null);
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

  // Passes customer registration information to the authentication service
  const handleCreateAccount = async () => {
    await handleCreateAccountService(
      newCustomerName,
      newCustomerPhone,
      newCustomerEmail,
      newCustomerPassword,
      setLoggedInCustomerName,
      setLoggedInCustomerPhone,
      setLoggedInCustomerEmail,
      setCreateAccountMessage,
      setIsCustomerLoggedIn,
      setScreen,
    );
  };

  // Passes customer login information to the authentication service
  const handleCustomerLogin = async () => {
    await handleCustomerLoginService(
      customerEmail,
      customerPassword,
      setLoggedInCustomerName,
      setLoggedInCustomerPhone,
      setLoggedInCustomerEmail,
      setCustomerLoginMessage,
      setIsCustomerLoggedIn,
      setScreen,
    );
  };

  // Tracks whether an order is being submitted to prevent duplicate submissions
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

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

  // Passes edited menu item information to the menu service
  const saveMenuItemChanges = async () => {
    await saveMenuItemChangesService(
      selectedAdminMenu,
      selectedAdminItemIndex,
      selectedAdminItemGroup,
      editItemName,
      editItemDescription,
      editItemPhoto,
      editItemPricingType,
      editItemPrice,
      editItemHalfPrice,
      editItemFullPrice,
      editItemStatus,
      editItemAddOnName,
      editItemAddOnPrice,
      setSelectedAdminMenu,
      loadAdminMenus,
      setScreen,
    );
  };

  // Passes the selected item information to the menu service for deletion
  const deleteMenuItem = async (groupField: string, itemIndex: number) => {
    await deleteMenuItemService(
      groupField,
      itemIndex,
      selectedAdminMenu,
      selectedAdminItem,
      setSelectedAdminMenu,
      loadAdminMenus,
    );
  };

  // Loads admin menus through the menu service
  const loadAdminMenus = async () => {
    await loadAdminMenusService(setAdminMenus);
  };

  // Loads admin orders through the order service
  const loadAdminOrders = async () => {
    await loadAdminOrdersService(setAdminOrders);
  };

  // Loads customer catering requests through the catering service
  const loadCateringRequests = async () => {
    await loadCateringRequestsService(setCateringRequests);
  };

  // Updates a catering request's status and refreshes the admin request list
  const updateCateringRequestStatus = async (
    requestId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      await updateCateringRequestStatusService(requestId, status);
      await loadCateringRequests();

      // Refreshes calendar availability after a catering request status changes
      await loadAvailability(setAvailability);
    } catch (error) {
      console.error("Unable to update catering request:", error);
    }
  };

  // Saves catering follow-up information and refreshes the request list
  const updateCateringFollowUp = async (
    requestId: string,
    followUpNeeded: boolean,
    followUpNotes: string,
  ) => {
    try {
      await updateCateringFollowUpService(
        requestId,
        followUpNeeded,
        followUpNotes,
      );

      await loadCateringRequests();
    } catch (error) {
      console.error("Unable to update catering follow-up:", error);
      throw error;
    }
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

  const isMenuActive = (menuName: string) => {
    const menu = adminMenus.find((menu: any) => menu.name === menuName);

    return menu?.active === true;
  };

  // Passes menu information to the shared menu service
  const toggleMenuActive = async (menuId: string, currentActive: boolean) => {
    await toggleMenuActiveService(
      menuId,
      currentActive,
      adminMenus,
      loadAdminMenus,
    );
  };

  // Creates a menu and resets the menu creation form
  const addNewMenu = async () => {
    try {
      await createMenu(
        newMenuName,
        newMenuDescription,
        newMenuType,
        newMenuLocation,
        newMenuEventName,
        newMenuActive,
      );

      // Clears the menu creation fields
      setNewMenuName("");
      setNewMenuDescription("");
      setNewMenuType("");
      setNewMenuLocation("");
      setNewMenuEventName("");
      setNewMenuActive(true);

      // Refreshes the menu list and returns to menu management
      await loadAdminMenus();
      setScreen("menuManagement");
    } catch (error) {
      console.error("Error adding menu:", error);
    }
  };

  // Passes the edited category information to the menu service
  const saveCategoryChanges = async () => {
    await saveCategoryChangesService(
      selectedAdminMenu,
      editingCategoryIndex,
      editCategoryName,
      editCategoryDescription,
      editCategoryParent,
      setSelectedAdminMenu,
      setEditingCategoryIndex,
      loadAdminMenus,
    );
  };

  // Passes the edited menu description to the menu service
  const saveMenuDescription = async () => {
    await saveMenuDescriptionService(
      selectedAdminMenu,
      editMenuDescription,
      setSelectedAdminMenu,
      loadAdminMenus,
      setIsEditingMenuDescription,
    );
  };

  // Passes the selected menu and category information to the menu service
  const addNewCategory = async () => {
    await addNewCategoryService(
      selectedAdminMenu,
      newCategoryName,
      newCategoryDescription,
      newCategoryParent,
      setSelectedAdminMenu,
      setNewCategoryName,
      setNewCategoryDescription,
      setNewCategoryParent,
      loadAdminMenus,
    );
  };

  // Passes new menu item information to the menu service
  const addNewMenuItem = async () => {
    await addNewMenuItemService(
      selectedAdminMenu,
      newItemCategoryIndex,
      newItemName,
      newItemDescription,
      newItemPhoto,
      setNewItemPhoto,
      newItemPricingType,
      newItemPrice,
      newItemHalfPrice,
      newItemFullPrice,
      newAddOnName,
      newAddOnPrice,
      additionalAddOns,
      setSelectedAdminMenu,
      setNewItemName,
      setNewItemDescription,
      setNewItemPrice,
      setNewItemPricingType,
      setNewItemHalfPrice,
      setNewItemFullPrice,
      setNewAddOnName,
      setNewAddOnPrice,
      setAdditionalAddOns,
      setNewItemCategoryIndex,
      loadAdminMenus,
    );
  };

  // Loads catering availability when the app starts
  useEffect(() => {
    loadAvailabilityService(setAvailability);
  }, []);

  // Deletes a menu from Firestore and refreshes the menu list
  const deleteMenu = async (menuId: string) => {
    try {
      await deleteDoc(doc(db, "menus", menuId));
      await loadAdminMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  // Passes catering availability changes to the catering service
  const toggleAvailability = async (dateKey: string) => {
    await toggleAvailabilityService(dateKey, availability, setAvailability);
  };

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

    // Preserves the submitted order total before clearing the cart
    setConfirmedOrderTotal(cartTotal);

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

  // Passes the catering request information to the catering service
  const submitCateringRequest = async () => {
    await submitCateringRequestService(
      cateringCustomerName,
      cateringContact,
      selectedCateringDate,
      cateringTime,
      cateringGuestCount,
      cateringMenuPreferences,
      cateringVenueName,
      cateringVenueAddress,
      cateringNotes,
      setScreen,
    );
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

  // Passes administrator login information to the authentication service
  const handleBusinessLogin = async () => {
    await handleBusinessLoginService(
      adminUsername,
      adminPassword,
      setLoginMessage,
      setIsAdminLoggedIn,
      setScreen,
    );
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
      selectedAddOns={selectedAddOns}
      setSelectedAddOns={setSelectedAddOns}
      selectedAddOnOptions={selectedAddOnOptions}
      setSelectedAddOnOptions={setSelectedAddOnOptions}
      addToCart={addToCart}
      setScreen={setScreen}
      cartTotal={cartTotal}
    />
  );

  // Displays the Onsite Event Catering screen using the shared component
  const OnsiteCateringMenuScreen = () => (
    <SharedOnsiteCateringMenuScreen
      Header={Header}
      selectedOnsiteCateringMenu={selectedOnsiteCateringMenu}
    />
  );

  // Displays the Onsite Event Menu Options screen using the shared component
  const OnsiteCateringMenuOptionsScreen = () => (
    <SharedOnsiteCateringMenuOptionsScreen
      Header={Header}
      onsiteCateringMenus={onsiteCateringMenus}
      setSelectedCateringMenuId={setSelectedCateringMenuId}
      setScreen={setScreen}
    />
  );

  // Displays the Catering Menu Options screen using the shared component
  const CateringMenuOptionsScreen = () => (
    <SharedCateringMenuOptionsScreen
      Header={Header}
      dropOffCateringMenus={dropOffCateringMenus}
      setSelectedCateringMenuId={setSelectedCateringMenuId}
      setScreen={setScreen}
    />
  );

  // Displays the Catering Menu screen using the shared component
  const DropOffCateringMenuScreen = () => (
    <SharedDropOffCateringMenuScreen
      Header={Header}
      selectedDropOffCateringMenu={selectedCateringMenu}
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
      isSubmittingOrder={isSubmittingOrder}
    />
  );

  // Displays the Order Confirmation screen using the shared component
  const OrderConfirmationScreen = () => (
    <SharedOrderConfirmationScreen
      Header={Header}
      paymentMethod={paymentMethod}
      cartTotal={confirmedOrderTotal}
      confirmedOrderId={confirmedOrderId}
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

  // Displays the shared Orders Management screen
  const OrdersManagementScreen = () => (
    <SharedOrdersManagementScreen
      Header={Header}
      BusinessBackButton={BusinessBackButton}
      adminOrders={adminOrders}
      markOrderAsFilled={markOrderAsFilled}
      markOrderAsPaid={markOrderAsPaid}
      markOrderAsOpen={markOrderAsOpen}
      markOrderAsCancelled={markOrderAsCancelled}
    />
  );

  // Displays the Catering Management screen using the shared component
  const CateringManagementScreen = () => (
    <SharedCateringManagementScreen
      Header={Header}
      BusinessBackButton={BusinessBackButton}
      cateringRequests={cateringRequests}
      updateCateringRequestStatus={updateCateringRequestStatus}
      updateCateringFollowUp={updateCateringFollowUp}
    />
  );

  // Displays the Catering Events screen using the shared component
  const CateringEventsScreen = () => (
    <SharedCateringEventsScreen
      Header={Header}
      BusinessBackButton={BusinessBackButton}
      cateringEvents={cateringRequests.filter(
        (request) => request.status === "accepted",
      )}
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
      newItemPhoto={newItemPhoto}
      setNewItemPhoto={setNewItemPhoto}
      editItemPhoto={editItemPhoto}
      setEditItemPhoto={setEditItemPhoto}
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

  // Passes the category information to the menu service for deletion
  const deleteMenuCategory = async (categoryIndex: number) => {
    await deleteMenuCategoryService(
      categoryIndex,
      selectedAdminMenu,
      setSelectedAdminMenu,
      loadAdminMenus,
    );
  };

  // Displays the shared Edit Menu Item screen
  const EditMenuItemScreen = () => (
    <SharedEditMenuItemScreen
      Header={Header}
      setScreen={setScreen}
      editItemName={editItemName}
      editItemPhoto={editItemPhoto}
      setEditItemPhoto={setEditItemPhoto}
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

  // Passes the current menu information to the menu service
  const saveMenuChanges = async () => {
    await saveMenuChangesService(
      selectedAdminMenu,
      editMenuName,
      editMenuDescription,
      editMenuType,
      editMenuLocation,
      editMenuEventName,
      loadAdminMenus,
      setScreen,
    );
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

  // Displays the shared Availability Management screen
  const AvailabilityManagementScreen = () => (
    <SharedAvailabilityManagementScreen
      Header={Header}
      BusinessBackButton={BusinessBackButton}
      currentMonth={currentMonth}
      currentYear={currentYear}
      monthNames={monthNames}
      goToPreviousMonth={goToPreviousMonth}
      goToNextMonth={goToNextMonth}
      firstDayOfMonth={firstDayOfMonth}
      daysInMonth={daysInMonth}
      today={today}
      availability={availability}
      toggleAvailability={toggleAvailability}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {screen === "home" && <HomeScreen />}
      {screen === "about" && <AboutScreen />}
      {screen === "order" && <OrderScreen />}
      {screen === "foodTrailer" && FoodTrailerScreen()}
      {screen === "onsiteEventCatering" && OnsiteCateringMenuScreen()}
      {screen === "onsiteEventMenuOptions" && OnsiteCateringMenuOptionsScreen()}
      {screen === "cart" && <CartScreen />}
      {screen === "checkout" && CheckoutScreen()}
      {screen === "customerLogin" && CustomerLoginScreen()}
      {screen === "createAccount" && CreateAccountScreen()}
      {screen === "orderConfirmation" && <OrderConfirmationScreen />}
      {screen === "catering" && <CateringScreen />}
      {screen === "cateringMenuOptions" && CateringMenuOptionsScreen()}
      {screen === "cateringMenu" && DropOffCateringMenuScreen()}
      {screen === "availabilityCalendar" && AvailabilityCalendarScreen()}
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
      {screen === "business" && (
        <BusinessDashboardScreen
          Header={Header}
          loadAdminOrders={loadAdminOrders}
          loadCateringRequests={loadCateringRequests}
          loadAdminMenus={loadAdminMenus}
          setScreen={setScreen}
        />
      )}
      {screen === "ordersManagement" && OrdersManagementScreen()}
      {/* Displays the administrator Payment Management screen */}
      {screen === "paymentManagement" && (
        <PaymentManagementScreen
          Header={Header}
          BusinessBackButton={BusinessBackButton}
        />
      )}
      {screen === "availabilityManagement" && AvailabilityManagementScreen()}
      {screen === "menuManagement" && MenuManagementScreen()}
      {screen === "addMenu" && AddMenuScreen()}
      {screen === "editMenu" && EditMenuScreen()}
      {screen === "manageMenuItems" && ManageMenuItemsScreen()}
      {screen === "editMenuItem" && EditMenuItemScreen()}
      {screen === "cateringManagement" && <CateringManagementScreen />}
      {screen === "cateringEvents" && <CateringEventsScreen />}
      <NavBar />
    </SafeAreaView>
  );
}
