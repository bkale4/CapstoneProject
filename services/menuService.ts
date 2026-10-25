// Imports Firestore functions for creating and managing menu documents
import { addDoc, collection } from "firebase/firestore";

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
