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

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

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
