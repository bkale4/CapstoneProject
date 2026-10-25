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
