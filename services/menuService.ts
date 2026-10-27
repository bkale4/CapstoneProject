// Imports Firestore functions for creating and managing menu documents
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// Imports the Firebase database connection
import { db } from "../firebaseConfig";

import type { Screen } from "../types";

// Creates a new menu in Firestore
export const createMenu = async (
  newMenuName: string,
  newMenuDescription: string,
  newMenuType: string,
  newMenuLocation: string,
  newMenuEventName: string,
  newMenuActive: boolean,
) => {
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
};

// Deletes a menu document from Firestore
export const deleteMenu = async (menuId: string) => {
  await deleteDoc(doc(db, "menus", menuId));
};

// Updates a menu's active status and deactivates other active Food Trailer menus
export const toggleMenuActive = async (
  menuId: string,
  currentActive: boolean,
  adminMenus: any[],
  loadAdminMenus: () => Promise<void>,
) => {
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

// Saves changes to an existing menu in Firestore
export const saveMenuChanges = async (
  selectedAdminMenu: any,
  editMenuName: string,
  editMenuDescription: string,
  editMenuType: string,
  editMenuLocation: string,
  editMenuEventName: string,
  loadAdminMenus: () => Promise<void>,
  setScreen: (screen: "menuManagement") => void,
) => {
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

// Adds a new category to the selected menu in Firestore
export const addNewCategory = async (
  selectedAdminMenu: any,
  newCategoryName: string,
  newCategoryDescription: string,
  newCategoryParent: string,
  setSelectedAdminMenu: (menu: any) => void,
  setNewCategoryName: (value: string) => void,
  setNewCategoryDescription: (value: string) => void,
  setNewCategoryParent: (value: string) => void,
  loadAdminMenus: () => Promise<void>,
) => {
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

// Saves changes to an existing menu category in Firestore
export const saveCategoryChanges = async (
  selectedAdminMenu: any,
  editingCategoryIndex: number | null,
  editCategoryName: string,
  editCategoryDescription: string,
  editCategoryParent: string,
  setSelectedAdminMenu: (menu: any) => void,
  setEditingCategoryIndex: (index: number | null) => void,
  loadAdminMenus: () => Promise<void>,
) => {
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

// Loads all menus from Firestore
export const loadAdminMenusService = async (
  setAdminMenus: React.Dispatch<React.SetStateAction<any>>,
) => {
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

// Saves the menu description in Firestore
export const saveMenuDescription = async (
  selectedAdminMenu: any,
  editMenuDescription: string,
  setSelectedAdminMenu: React.Dispatch<React.SetStateAction<any>>,
  loadAdminMenus: () => Promise<void>,
  setIsEditingMenuDescription: React.Dispatch<React.SetStateAction<boolean>>,
) => {
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

// Deletes a category from the selected menu
export const deleteMenuCategory = async (
  categoryIndex: number,
  selectedAdminMenu: any,
  setSelectedAdminMenu: React.Dispatch<React.SetStateAction<any>>,
  loadAdminMenus: () => Promise<void>,
) => {
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

// Saves changes to an existing menu item in Firestore
export const saveMenuItemChanges = async (
  selectedAdminMenu: any,
  selectedAdminItemIndex: number | null,
  selectedAdminItemGroup: string,
  editItemName: string,
  editItemDescription: string,
  editItemPricingType: "single" | "halfFull",
  editItemPrice: string,
  editItemHalfPrice: string,
  editItemFullPrice: string,
  editItemStatus: string,
  editItemAddOnName: string,
  editItemAddOnPrice: string,
  setSelectedAdminMenu: React.Dispatch<React.SetStateAction<any>>,
  loadAdminMenus: () => Promise<void>,
  setScreen: (screen: Screen) => void,
) => {
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
