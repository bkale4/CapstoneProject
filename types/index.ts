// Defines the available screens in the application
export type Screen =
  | "home"
  | "about"
  | "order"
  | "foodTrailer"
  | "onsiteEventCatering"
  | "onsiteEventMenuOptions"
  | "cart"
  | "checkout"
  | "customerLogin"
  | "createAccount"
  | "orderConfirmation"
  | "catering"
  | "cateringMenu"
  | "cateringMenuOptions"
  | "availabilityCalendar"
  | "cateringRequest"
  | "cateringConfirmation"
  | "businessLogin"
  | "business"
  | "ordersManagement"
  | "cateringManagement"
  | "menuManagement"
  | "addMenu"
  | "editMenu"
  | "manageMenuItems"
  | "editMenuItem"
  | "availabilityManagement";

// Defines the information stored for each cart item
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

// Defines the properties required by the Business Login screen
export type BusinessLoginScreenProps = {
  Header: ({ title }: { title: string }) => React.JSX.Element;
  styles: any;
  adminUsername: string;
  setAdminUsername: React.Dispatch<React.SetStateAction<string>>;
  adminPassword: string;
  setAdminPassword: React.Dispatch<React.SetStateAction<string>>;
  handleBusinessLogin: () => void;
  loginMessage: string;
};

// Defines the properties required by the Home screen
export type HomeScreenProps = {
  Header: ({ title }: { title: string }) => React.JSX.Element;
  activeFoodTrailerMenu: any;
  foodTrailerLocation: string;
  foodTrailerEventName: string;
  setSelectedMenuType: (value: string) => void;
  setSelectedLocation: (value: string) => void;
  setSelectedEvent: (value: string) => void;
  setScreen: (screen: Screen) => void;
};

// Defines the properties required by the About screen
export type AboutScreenProps = {
  Header: ({ title }: { title: string }) => React.JSX.Element;
};

// Defines the properties required by the Order screen
export type OrderScreenProps = {
  Header: ({ title }: { title: string }) => React.JSX.Element;
  isMenuActive: (menuName: string) => boolean;
  foodTrailerLocation: string;
  foodTrailerEventName: string;
  setSelectedMenuType: (value: string) => void;
  setSelectedLocation: (value: string) => void;
  setSelectedEvent: (value: string) => void;
  setScreen: (screen: Screen) => void;
};

// Defines the properties required by the Food Trailer screen
export type FoodTrailerScreenProps = {
  // Defines the Header component used to display the screen title
  Header: ({ title }: { title: string }) => React.JSX.Element;

  // Active menu information loaded from Firestore
  activeFoodTrailerMenu: any;
  foodTrailerLocation: string;
  foodTrailerEventName: string;

  // Controls which menu categories are expanded
  expandedCategories: number[];
  setExpandedCategories: React.Dispatch<React.SetStateAction<number[]>>;
  expandedParentCategories: string[];
  setExpandedParentCategories: React.Dispatch<React.SetStateAction<string[]>>;

  // Tracks the customer's selected menu item add-ons
  selectedAddOns: string[];
  setSelectedAddOns: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAddOnOptions: Record<string, number>;
  setSelectedAddOnOptions: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;

  // Adds the selected menu item to the customer's cart
  addToCart: (id: string, name: string, price: number) => void;

  // Navigates to another screen in the application
  setScreen: (screen: Screen) => void;

  // Displays the current total price of items in the cart
  cartTotal: number;
};

// Defines the properties required by the Catering Menu Options screen
export type CateringMenuOptionsScreenProps = {
  Header: React.ComponentType<{ title: string }>;
  dropOffCateringMenus: { id: string; name: string }[];
  setSelectedCateringMenuId: (id: string) => void;
  setExpandedDropOffCategories: React.Dispatch<React.SetStateAction<number[]>>;
  setScreen: (screen: Screen) => void;
};

// Defines the properties required by the Catering Menu screen
export type CateringMenuScreenProps = {
  Header: React.ComponentType<{ title: string }>;
  selectedCateringMenu:
    | {
        name: string;
        type: string;
        description?: string;
        categories?: {
          name: string;
          items?: {
            name: string;
            description?: string;
            pricingType?: string;
            halfPrice?: number;
            fullPrice?: number;
            price?: number;
            status?: string;
          }[];
        }[];
      }
    | null
    | undefined;
  expandedDropOffCategories: number[];
  setExpandedDropOffCategories: React.Dispatch<React.SetStateAction<number[]>>;
};

// Defines the properties required by the Catering Services screen
export type CateringScreenProps = {
  Header: React.ComponentType<{ title: string }>;
  setScreen: (screen: Screen) => void;
};

// Defines the properties required by the Catering Request screen
export type CateringRequestScreenProps = {
  Header: React.ComponentType<{ title: string }>;
  selectedCateringDate: string;
  formatCateringDate: (date: string) => string;
  cateringCustomerName: string;
  setCateringCustomerName: React.Dispatch<React.SetStateAction<string>>;
  cateringTime: string;
  setCateringTime: React.Dispatch<React.SetStateAction<string>>;
  cateringGuestCount: string;
  setCateringGuestCount: React.Dispatch<React.SetStateAction<string>>;
  cateringMenuPreferences: string;
  setCateringMenuPreferences: React.Dispatch<React.SetStateAction<string>>;
  cateringContact: string;
  setCateringContact: React.Dispatch<React.SetStateAction<string>>;
  cateringVenueName: string;
  setCateringVenueName: React.Dispatch<React.SetStateAction<string>>;
  cateringVenueAddress: string;
  setCateringVenueAddress: React.Dispatch<React.SetStateAction<string>>;
  cateringNotes: string;
  setCateringNotes: React.Dispatch<React.SetStateAction<string>>;
  submitCateringRequest: () => void | Promise<void>;
};

// Defines the properties required by the Catering Confirmation screen
export type CateringConfirmationScreenProps = {
  Header: React.ComponentType<{ title: string }>;
  setScreen: (screen: Screen) => void;
};

// Defines the properties required by the Catering Management screen
export type CateringManagementScreenProps = {
  Header: React.ComponentType<{ title: string }>;
  BusinessBackButton: React.ComponentType;
};

// Defines the properties required by the Cart screen
export type CartScreenProps = {
  Header: React.ComponentType<{ title: string }>;
  cartItems: CartItem[];
  cartTotal: number;
  decreaseQuantity: (id: string) => void;
  increaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setScreen: (screen: Screen) => void;
};

// Defines the properties requireed by the Checkout screen
export type CheckoutScreenProps = {
  Header: React.ComponentType<{ title: string }>;
  isCustomerLoggedIn: boolean;
  loggedInCustomerName: string;
  loggedInCustomerPhone: string;
  loggedInCustomerEmail: string;
  setScreen: (screen: Screen) => void;
  continueAsGuest: boolean;
  setContinueAsGuest: React.Dispatch<React.SetStateAction<boolean>>;
  guestName: string;
  setGuestName: React.Dispatch<React.SetStateAction<string>>;
  guestPhone: string;
  setGuestPhone: React.Dispatch<React.SetStateAction<string>>;
  guestEmail: string;
  setGuestEmail: React.Dispatch<React.SetStateAction<string>>;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
  cartItems: CartItem[];
  cartTotal: number;
  submitOrder: () => void | Promise<void>;
};
