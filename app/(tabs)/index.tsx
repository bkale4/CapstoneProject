// Imports React and the state hook used to manage screen navigation
import React, { useState } from "react";

// Imports SafeAreaView for handling screen safe areas
import { SafeAreaView } from "react-native-safe-area-context";

// Imports the shared application styles
import { styles } from "../../styles/styles";

// Imports the Screen type used for application navigation
import type { Screen } from "../../types/types";

// Imports the shared customer and admin authentication screens
import {
  BusinessLoginScreen as SharedBusinessLoginScreen,
  CreateAccountScreen as SharedCreateAccountScreen,
  CustomerLoginScreen as SharedCustomerLoginScreen,
} from "../../screens/AuthenticationScreens";

// Imports the Header factory that connects the header to Home navigation
import { createHomeHeader } from "../../components/Header";

// Imports the navigation bar factory that connects it to the application state
import { createAppNavBar } from "../../components/NavBar";

// Imports the shared Home screen component
import { HomeScreen as SharedHomeScreen } from "../../screens/HomeScreen";

// Imports the shared About screen component
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
import {
  BusinessDashboardScreen,
  BusinessBackButton as SharedBusinessBackButton,
} from "../../screens/BusinessDashBoardScreen";

// Imports the hook that manages the customer's shopping cart
import { useCart } from "../../hooks/useCart";

// Imports the hook for managing authentication state
import { useAuth } from "../../hooks/useAuth";

// Imports the hook for managing checkout and order confirmation state
import { useCheckout } from "../../hooks/useCheckout";

// Imports the hook for managing customer-facing menu information
import { useMenus } from "../../hooks/useMenus";

// Imports the admin menu management hook
import { useMenuManagement } from "../../hooks/useMenuManagement";

// Imports the hook for managing customer orders
import { useOrders } from "../../hooks/useOrders";

// Imports the hook for managing catering requests and availability
import { useCatering } from "../../hooks/useCatering";

// Imports the hook that manages calendar dates and month navigation
import { useCalendar } from "../../hooks/useCalendar";

// Defines the main application component and manages screen navigation
export default function App() {
  // Tracks the currently displayed screen, starting with the Home screen
  const [screen, setScreen] = useState<Screen>("home");

  // Retrieves the cart state and its update function from the cart hook
  const {
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
  } = useCart(screen);

  // Retrieves admin login state from the authentication hook
  const {
    adminUsername,
    setAdminUsername,
    adminPassword,
    setAdminPassword,
    loginMessage,
    setLoginMessage,
    continueAsGuest,
    setContinueAsGuest,
    newCustomerName,
    setNewCustomerName,
    newCustomerPhone,
    setNewCustomerPhone,
    newCustomerEmail,
    setNewCustomerEmail,
    newCustomerPassword,
    setNewCustomerPassword,
    createAccountMessage,
    setCreateAccountMessage,
    isCustomerLoggedIn,
    setIsCustomerLoggedIn,
    customerEmail,
    setCustomerEmail,
    customerPassword,
    setCustomerPassword,
    customerLoginMessage,
    setCustomerLoginMessage,
    loggedInCustomerName,
    setLoggedInCustomerName,
    loggedInCustomerPhone,
    setLoggedInCustomerPhone,
    loggedInCustomerEmail,
    setLoggedInCustomerEmail,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    guestEmail,
    setGuestEmail,
    handleCreateAccount,
    handleCustomerLogin,
    handleBusinessLogin,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
  } = useAuth(setScreen);

  // Retrieves the active Food Trailer menu and its location information
  const {
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
    dropOffCateringMenus,
    selectedDropOffCateringMenu,
    onsiteCateringMenus,
    selectedOnsiteCateringMenu,
    selectedMenuType,
    setSelectedMenuType,
    selectedLocation,
    setSelectedLocation,
    selectedEvent,
    setSelectedEvent,
  } = useMenus({
    cartItemsRef,
    setCartItems,
    setSoldOutCartNotice,
    setInactiveMenuCartNotice,
  });

  // Retrieves the admin menu state
  const {
    adminMenus,
    setAdminMenus,
    manageMenuScrollRef,
    showBackToTop,
    setShowBackToTop,
    newMenuName,
    setNewMenuName,
    editMenuName,
    setEditMenuName,
    newMenuDescription,
    setNewMenuDescription,
    editMenuDescription,
    setEditMenuDescription,
    isEditingMenuDescription,
    setIsEditingMenuDescription,
    newMenuType,
    setNewMenuType,
    editMenuType,
    setEditMenuType,
    editMenuTypeDropdown,
    setEditMenuTypeDropdown,
    menuTypeDropdown,
    setMenuTypeDropdown,
    newMenuLocation,
    setNewMenuLocation,
    editMenuLocation,
    setEditMenuLocation,
    newMenuEventName,
    setNewMenuEventName,
    editMenuEventName,
    setEditMenuEventName,
    newMenuActive,
    setNewMenuActive,
    newCategoryName,
    setNewCategoryName,
    newCategoryDescription,
    setNewCategoryDescription,
    newCategoryParent,
    setNewCategoryParent,
    editingCategoryIndex,
    setEditingCategoryIndex,
    editCategoryName,
    setEditCategoryName,
    editCategoryDescription,
    setEditCategoryDescription,
    editCategoryParent,
    setEditCategoryParent,
    newItemName,
    setNewItemName,
    newItemDescription,
    setNewItemDescription,
    newItemPhoto,
    setNewItemPhoto,
    newItemPrice,
    setNewItemPrice,
    newItemPricingType,
    setNewItemPricingType,
    newItemHalfPrice,
    setNewItemHalfPrice,
    newItemFullPrice,
    setNewItemFullPrice,
    newItemCategoryIndex,
    setNewItemCategoryIndex,
    newAddOnName,
    setNewAddOnName,
    newAddOnPrice,
    setNewAddOnPrice,
    additionalAddOns,
    setAdditionalAddOns,
    selectedAdminMenu,
    setSelectedAdminMenu,
    selectedAdminItem,
    setSelectedAdminItem,
    selectedAdminItemGroup,
    setSelectedAdminItemGroup,
    selectedAdminItemIndex,
    setSelectedAdminItemIndex,
    editItemName,
    setEditItemName,
    editItemDescription,
    setEditItemDescription,
    editItemPhoto,
    setEditItemPhoto,
    editItemPrice,
    setEditItemPrice,
    editItemPricingType,
    setEditItemPricingType,
    editItemHalfPrice,
    setEditItemHalfPrice,
    editItemFullPrice,
    setEditItemFullPrice,
    editItemStatus,
    setEditItemStatus,
    itemStatusDropdown,
    setItemStatusDropdown,
    editItemAddOnName,
    setEditItemAddOnName,
    editItemAddOnPrice,
    setEditItemAddOnPrice,
    loadAdminMenus,
    saveMenuItemChanges,
    deleteMenuItem,
    deleteMenuCategory,
    isMenuActive,
    toggleMenuActive,
    addNewMenu,
    saveCategoryChanges,
    saveMenuDescription,
    addNewCategory,
    addNewMenuItem,
    deleteMenu,
    getAdminMenuItemGroups,
    saveMenuChanges,
  } = useMenuManagement(setScreen);

  // Retrieves the admin order state
  const {
    adminOrders,
    setAdminOrders,
    loadAdminOrders,
    markOrderAsFilled,
    markOrderAsPaid,
    markOrderAsOpen,
    markOrderAsCancelled,
  } = useOrders();

  // Retrives catering request state from the catering hook
  const {
    cateringRequests,
    setCateringRequests,
    availability,
    setAvailability,
    cateringCustomerName,
    setCateringCustomerName,
    cateringContact,
    setCateringContact,
    selectedCateringDate,
    setSelectedCateringDate,
    cateringTime,
    setCateringTime,
    cateringGuestCount,
    setCateringGuestCount,
    cateringMenuPreferences,
    setCateringMenuPreferences,
    cateringVenueName,
    setCateringVenueName,
    cateringVenueAddress,
    setCateringVenueAddress,
    cateringNotes,
    setCateringNotes,
    loadCateringRequests,
    updateCateringRequestStatus,
    updateCateringFollowUp,
    toggleAvailability,
    submitCateringRequest,
  } = useCatering(setScreen);

  // Retrieves calendar dates, navigation functions, and formatting controls
  const {
    today,
    currentMonth,
    currentYear,
    goToPreviousMonth,
    goToNextMonth,
    monthNames,
    daysInMonth,
    firstDayOfMonth,
    formatCateringDate,
  } = useCalendar();

  // Connects customer, menu, cart, and payment information to checkout
  const {
    confirmedOrderTotal,
    setConfirmedOrderTotal,
    confirmedOrderId,
    setConfirmedOrderId,
    isSubmittingOrder,
    setIsSubmittingOrder,
    submitOrder,
    paymentMethod,
    setPaymentMethod,
  } = useCheckout({
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
  });

  // Connects the Business Dashboard back button to application navigation
  const BusinessBackButton = () => (
    <SharedBusinessBackButton setScreen={setScreen} />
  );

  // Connects the shared Header to the Home screen
  const Header = createHomeHeader(() => setScreen("home"));

  // Connects the navigation bar to the current screen and administrator login state
  const NavBar = createAppNavBar(setScreen, isAdminLoggedIn);

  // Renders the current screen and application navigation
  return (
    // Provides a safe display area for the application's content
    <SafeAreaView style={styles.container}>
      {/* Displays the Home screen with its menu information and navigation functions */}
      {screen === "home" && (
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
      )}
      {/* Displays the About screen with the shared Header */}
      {screen === "about" && <SharedAboutScreen Header={Header} />}

      {/* Connects the Order screen to the application's menu data, navigation, and customer ordering selections */}
      {screen === "order" && (
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
      )}

      {/* Connects the Food Trailer screen to the application's menu data, category controls, add-ons, cart, and navigation. */}
      {screen === "foodTrailer" && (
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
      )}
      {/* Displays the Onsite Event Catering screen using the shared component */}
      {screen === "onsiteEventCatering" && (
        <SharedOnsiteCateringMenuScreen
          Header={Header}
          selectedOnsiteCateringMenu={selectedOnsiteCateringMenu}
        />
      )}
      {/* Displays the Onsite Event Menu Options screen using the shared component */}
      {screen === "onsiteEventMenuOptions" && (
        <SharedOnsiteCateringMenuOptionsScreen
          Header={Header}
          onsiteCateringMenus={onsiteCateringMenus}
          setSelectedCateringMenuId={setSelectedCateringMenuId}
          setScreen={setScreen}
        />
      )}
      {/* Displays the Catering Menu Options screen using the shared component */}
      {screen === "cateringMenuOptions" && (
        <SharedCateringMenuOptionsScreen
          Header={Header}
          dropOffCateringMenus={dropOffCateringMenus}
          setSelectedCateringMenuId={setSelectedCateringMenuId}
          setScreen={setScreen}
        />
      )}
      {/* Displays the Catering Menu screen using the shared component */}
      {screen === "cateringMenu" && (
        <SharedDropOffCateringMenuScreen
          Header={Header}
          selectedDropOffCateringMenu={selectedDropOffCateringMenu}
        />
      )}
      {/* Displays the Cart screen using the shared component */}
      {screen === "cart" && (
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
      )}
      {/* Displays the Customer Login screen with account credentials and login functionality */}
      {screen === "customerLogin" && (
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
      )}
      {/* Displays the Create Account screen using the shared component */}
      {screen === "createAccount" && (
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
      )}
      {/* Displays the Checkout screen using the shared component */}
      {screen === "checkout" && (
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
          salesTax={salesTax}
          finalTotal={finalTotal}
          submitOrder={submitOrder}
          isSubmittingOrder={isSubmittingOrder}
        />
      )}
      {/* Displays the Order Confirmation screen using the shared component */}
      {screen === "orderConfirmation" && (
        <SharedOrderConfirmationScreen
          Header={Header}
          paymentMethod={paymentMethod}
          cartTotal={confirmedOrderTotal}
          confirmedOrderId={confirmedOrderId}
          setScreen={setScreen}
        />
      )}
      {/* Displays the Catering Services screen using the shared component */}
      {screen === "catering" && (
        <SharedCateringScreen Header={Header} setScreen={setScreen} />
      )}
      {/* Displays the catering availability calendar with date selection and month navigation */}
      {screen === "availabilityCalendar" && (
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
      )}
      {/* Displays the Catering Request screen using the shared component */}
      {screen === "cateringRequest" && (
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
      )}
      {/* Displays the Catering Confirmation screen using the shared component */}
      {screen === "cateringConfirmation" && (
        <SharedCateringConfirmationScreen
          Header={Header}
          setScreen={setScreen}
        />
      )}
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
      {/*Displays the shared Orders Management screen */}
      {screen === "ordersManagement" && (
        <SharedOrdersManagementScreen
          Header={Header}
          BusinessBackButton={BusinessBackButton}
          adminOrders={adminOrders}
          markOrderAsFilled={markOrderAsFilled}
          markOrderAsPaid={markOrderAsPaid}
          markOrderAsOpen={markOrderAsOpen}
          markOrderAsCancelled={markOrderAsCancelled}
        />
      )}
      {/* Displays the administrator Payment Management screen */}
      {screen === "paymentManagement" && (
        <PaymentManagementScreen
          Header={Header}
          BusinessBackButton={BusinessBackButton}
        />
      )}
      {/* Displays the Catering Management screen using the shared component */}
      {screen === "cateringManagement" && (
        <SharedCateringManagementScreen
          Header={Header}
          BusinessBackButton={BusinessBackButton}
          cateringRequests={cateringRequests}
          updateCateringRequestStatus={updateCateringRequestStatus}
          updateCateringFollowUp={updateCateringFollowUp}
        />
      )}
      {/* Displays the Catering Events screen using the shared component */}
      {screen === "cateringEvents" && (
        <SharedCateringEventsScreen
          Header={Header}
          BusinessBackButton={BusinessBackButton}
          cateringEvents={cateringRequests.filter(
            (request) => request.status === "accepted",
          )}
        />
      )}
      {/* Displays the Menu Management screen using the shared  */}
      {screen === "menuManagement" && (
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
      )}
      {/* Displays the shared Manage Menu Items screen */}
      {screen === "manageMenuItems" && (
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
      )}
      {/* Displays the shared Edit Menu Item screen */}
      {screen === "editMenuItem" && (
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
          additionalAddOns={additionalAddOns}
          setAdditionalAddOns={setAdditionalAddOns}
          editItemStatus={editItemStatus}
          setEditItemStatus={setEditItemStatus}
          itemStatusDropdown={itemStatusDropdown}
          setItemStatusDropdown={setItemStatusDropdown}
          saveMenuItemChanges={saveMenuItemChanges}
        />
      )}
      {/* Displays the Add Menu screen using the shared component */}
      {screen === "addMenu" && (
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
      )}
      {/* Displays the Edit Menu screen using the shared component*/}
      {screen === "editMenu" && (
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
      )}
      {/* Displays the shared Availability Management screen */}
      {screen === "availabilityManagement" && (
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
      )}
      {/* Displays the application's bottom navigation bar */}
      <NavBar />
    </SafeAreaView>
  );
}
