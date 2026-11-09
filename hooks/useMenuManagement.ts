import { useRef, useState } from "react";

import type { ScrollView } from "react-native";

// Imports Firestore functions for deleting menu documents
import { deleteDoc, doc } from "firebase/firestore";

// Imports the application's Firebase database connection
import { db } from "../firebaseConfig";

import {
    addNewCategory as addNewCategoryService,
    addNewMenuItem as addNewMenuItemService,
    createMenu,
    deleteMenuCategory as deleteMenuCategoryService,
    deleteMenuItem as deleteMenuItemService,
    saveCategoryChanges as saveCategoryChangesService,
    saveMenuChanges as saveMenuChangesService,
    saveMenuDescription as saveMenuDescriptionService,
    saveMenuItemChanges as saveMenuItemChangesService,
    toggleMenuActive as toggleMenuActiveService,
} from "../services/menuService";

// Imports the type used for application navigation
import type { Dispatch, SetStateAction } from "react";
import type { Screen } from "../types/types";

import { loadAdminMenusService } from "../services/menuService";

// Manages admin menu state and functionality
export const useMenuManagement = (
  setScreen: Dispatch<SetStateAction<Screen>>,
) => {
  // Stores menus retrieved from Firestore for admin management
  const [adminMenus, setAdminMenus] = useState<any>([]);

  // References the Manage Menu Items screen's ScrollView
  const manageMenuScrollRef = useRef<ScrollView>(null);

  // Tracks whether the Back to Top button should be displayed
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Stores menu names and descriptions for creating and editing menus
  const [newMenuName, setNewMenuName] = useState("");
  const [editMenuName, setEditMenuName] = useState("");
  const [newMenuDescription, setNewMenuDescription] = useState("");
  const [editMenuDescription, setEditMenuDescription] = useState("");
  const [isEditingMenuDescription, setIsEditingMenuDescription] =
    useState(false);

  // Manages menu types and their dropdown controls
  const [newMenuType, setNewMenuType] = useState("");
  const [editMenuType, setEditMenuType] = useState("");
  const [editMenuTypeDropdown, setEditMenuTypeDropdown] = useState(false);
  const [menuTypeDropdown, setMenuTypeDropdown] = useState(false);

  // Stores menu locations and associated event names
  const [newMenuLocation, setNewMenuLocation] = useState("");
  const [editMenuLocation, setEditMenuLocation] = useState("");
  const [newMenuEventName, setNewMenuEventName] = useState("");
  const [editMenuEventName, setEditMenuEventName] = useState("");

  // Tracks whether a newly created menu is active
  const [newMenuActive, setNewMenuActive] = useState(true);

  // Stores information for creating new menu categories
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryParent, setNewCategoryParent] = useState("");

  // Tracks which menu category is curently being edited
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<
    number | null
  >(null);

  // Stores information for editing existing menu categories
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [editCategoryParent, setEditCategoryParent] = useState("");

  // Stores the name, description, and photo for a new menu item
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemPhoto, setNewItemPhoto] = useState<string | null>(null);

  // Manages single-price and Half/Full pricing for new menu items
  const [newItemPricingType, setNewItemPricingType] = useState<
    "single" | "halfFull"
  >("single");
  const [newItemHalfPrice, setNewItemHalfPrice] = useState("");
  const [newItemFullPrice, setNewItemFullPrice] = useState("");

  // Tracks the category selected for the new menu item
  const [newItemCategoryIndex, setNewItemCategoryIndex] = useState<
    number | null
  >(null);

  // Stores optional add-ons and their prices for new menu items
  const [newAddOnName, setNewAddOnName] = useState("");
  const [newAddOnPrice, setNewAddOnPrice] = useState("");
  const [additionalAddOns, setAdditionalAddOns] = useState<
    { name: string; price: string }[]
  >([]);

  // Stores the menu currently selected for admin management
  const [selectedAdminMenu, setSelectedAdminMenu] = useState<any>(null);

  // Stores the menu item currently selected for editing
  const [selectedAdminItem, setSelectedAdminItem] = useState<any>(null);

  // Tracks the category or item group containing the selected menu item
  const [selectedAdminItemGroup, setSelectedAdminItemGroup] = useState("");

  // Tracks the selected item's position whitin its group
  const [selectedAdminItemIndex, setSelectedAdminItemIndex] = useState<
    number | null
  >(null);

  // Stores the name, description, and photo of the menu item being edited
  const [editItemName, setEditItemName] = useState("");
  const [editItemDescription, setEditItemDescription] = useState("");
  const [editItemPhoto, setEditItemPhoto] = useState<string | null>(null);

  // Manages single-price and Half/Full pricing when editing menu items
  const [editItemPrice, setEditItemPrice] = useState("");
  const [editItemPricingType, setEditItemPricingType] = useState<
    "single" | "halfFull"
  >("single");
  const [editItemHalfPrice, setEditItemHalfPrice] = useState("");
  const [editItemFullPrice, setEditItemFullPrice] = useState("");

  // Stores the selected item's availability status and dropdown visibility
  const [editItemStatus, setEditItemStatus] = useState("");
  const [itemStatusDropdown, setItemStatusDropdown] = useState(false);

  // Stores the add-on name and price when editing a menu item
  const [editItemAddOnName, setEditItemAddOnName] = useState("");
  const [editItemAddOnPrice, setEditItemAddOnPrice] = useState("");

  // Loads admin menus through the menu service
  const loadAdminMenus = async () => {
    await loadAdminMenusService(setAdminMenus);
  };

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
      additionalAddOns,
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

  // Passes the category information to the menu service for deletion
  const deleteMenuCategory = async (categoryIndex: number) => {
    await deleteMenuCategoryService(
      categoryIndex,
      selectedAdminMenu,
      setSelectedAdminMenu,
      loadAdminMenus,
    );
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

  // Deletes a menu from Firestore and refreshes the menu list
  const deleteMenu = async (menuId: string) => {
    try {
      await deleteDoc(doc(db, "menus", menuId));
      await loadAdminMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  // Organizes admin menu items by category or into a single group
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

  return {
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
  };
};
