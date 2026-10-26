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
