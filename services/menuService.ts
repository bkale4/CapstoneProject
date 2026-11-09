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

// Compresses selected photos and saves them to Firestore
import {
    compressMenuItemPhoto,
    deleteMenuItemPhoto,
    saveMenuItemPhoto,
} from "./imageService";

import type { Screen } from "../types/types";

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
    // Gets the existing categories and the requested parent category name
    const existingCategories = selectedAdminMenu.categories || [];
    const parentName = newCategoryParent.trim();

    // Collects parent category names already used by the menu
    const parentCategories = [
      ...new Set(
        existingCategories
          .map((category: any) => category.parentCategory?.trim() || "")
          .filter((name: string) => name !== ""),
      ),
    ];

    // Creates a parent category entry if one does not already exist
    const parentExists = existingCategories.some(
      (category: any) =>
        category.name.trim() === parentName && !category.parentCategory?.trim(),
    );

    // Preserves existing categories and creates parent categories only when needed
    const updatedCategories = [
      ...existingCategories,

      // Creates entries for existing parent categories that do not already have one
      ...parentCategories
        .filter(
          (name) =>
            !existingCategories.some(
              (category: any) =>
                category.name?.trim() === name &&
                !category.parentCategory?.trim(),
            ),
        )
        .map((name) => ({
          name,
          description: "",
          parentCategory: "",
          items: [],
        })),

      // Creates the selected parent only if it does not already exist
      ...(parentName && !parentExists && !parentCategories.includes(parentName)
        ? [
            {
              name: parentName,
              description: "",
              parentCategory: "",
              items: [],
            },
          ]
        : []),

      // Adds the new category entered by the client
      {
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
        parentCategory: parentName,
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
  editItemPhoto: string | null,
  editItemPricingType: "single" | "halfFull",
  editItemPrice: string,
  editItemHalfPrice: string,
  editItemFullPrice: string,
  editItemStatus: string,
  editItemAddOnName: string,
  editItemAddOnPrice: string,
  additionalAddOns: { name: string; price: string }[],
  setSelectedAdminMenu: React.Dispatch<React.SetStateAction<any>>,
  loadAdminMenus: () => Promise<void>,
  setScreen: (screen: Screen) => void,
) => {
  if (!selectedAdminMenu || selectedAdminItemIndex === null) {
    return;
  }

  if (editItemPricingType == "single") {
    if (!Number.isFinite(Number(editItemPrice)) || Number(editItemPrice) < 0) {
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

  // Combines the first add-on with any additional add-ons
  const allAddOns = [
    ...(hasAddOn
      ? [{ name: editItemAddOnName.trim(), price: addOnPrice }]
      : []),
    ...additionalAddOns.map((addOn) => ({
      name: addOn.name.trim(),
      price: Number(addOn.price),
    })),
  ];

  // Prevents invalid additional add-ons from being saved
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

  if (
    (hasAddOn &&
      (!editItemAddOnPrice.trim() ||
        !Number.isFinite(addOnPrice) ||
        addOnPrice < 0)) ||
    (!hasAddOn && editItemAddOnPrice.trim())
  ) {
    return;
  }

  // Identifies a newly selected photo that needs to be saved to Firestore
  const hasNewPhoto =
    !!editItemPhoto && !editItemPhoto.startsWith("data:image/");

  try {
    const isCustomCategory = selectedAdminItemGroup.startsWith("categories.");

    const categoryIndex = isCustomCategory
      ? Number(selectedAdminItemGroup.split(".")[1])
      : -1;

    // Creates an ID for older menu items that do not already have one
    const existingItem = isCustomCategory
      ? selectedAdminMenu.categories?.[categoryIndex]?.items?.[
          selectedAdminItemIndex
        ]
      : selectedAdminMenu[selectedAdminItemGroup]?.[selectedAdminItemIndex];

    const itemPhotoId =
      existingItem?.id || doc(collection(db, "menuItemImages")).id;

    const updatedItems = isCustomCategory
      ? [...(selectedAdminMenu.categories?.[categoryIndex]?.items || [])]
      : [...(selectedAdminMenu[selectedAdminItemGroup] || [])];

    updatedItems[selectedAdminItemIndex] = {
      ...updatedItems[selectedAdminItemIndex],
      id: itemPhotoId,
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
      // Saves the complete add-on list and maintains the first add-on for compatibility
      ...(allAddOns.length > 0 && {
        addOns: allAddOns,
        addOn: allAddOns[0],
      }),
    };

    // Removes both add-on fields when no add-ons remain
    if (allAddOns.length === 0) {
      delete updatedItems[selectedAdminItemIndex].addOn;
      delete updatedItems[selectedAdminItemIndex].addOns;
    }

    if (editItemPricingType === "single") {
      delete updatedItems[selectedAdminItemIndex].halfPrice;
      delete updatedItems[selectedAdminItemIndex].fullPrice;
    } else {
      delete updatedItems[selectedAdminItemIndex].price;
    }

    // Saves a replacement photo only when the admin selects a new image
    if (hasNewPhoto && editItemPhoto) {
      const compressPhoto = await compressMenuItemPhoto(editItemPhoto);
      await saveMenuItemPhoto(itemPhotoId, compressPhoto);
    }

    // Deletes the saved photo when the admin removes it
    if (editItemPhoto === null && existingItem?.id) {
      await deleteMenuItemPhoto(existingItem.id);
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

// Deletes an item from the selected menu
export const deleteMenuItem = async (
  groupField: string,
  itemIndex: number,
  selectedAdminMenu: any,
  selectedAdminItem: any,
  setSelectedAdminMenu: React.Dispatch<React.SetStateAction<any>>,
  loadAdminMenus: () => Promise<void>,
) => {
  const isCustomCategory = groupField.startsWith("categories.");

  const categoryIndex = isCustomCategory
    ? Number(groupField.split(".")[1])
    : -1;

  const updatedItems = isCustomCategory
    ? [...(selectedAdminMenu.categories?.[categoryIndex]?.items || [])]
    : [...(selectedAdminMenu[groupField] || [])];

  // Saves the item's photo ID before removing it from the menu
  const deletedItemPhotoId = updatedItems[itemIndex]?.id;

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

    // Deletes the associated photo after the menu item is successfully removed
    if (deletedItemPhotoId) {
      await deleteMenuItemPhoto(deletedItemPhotoId);
    }

    await loadAdminMenus();
  } catch (error) {
    console.error("Error deleting menu item:", error);
  }
};

// Adds a new menu item to the selected category in Firestore
export const addNewMenuItem = async (
  selectedAdminMenu: any,
  newItemCategoryIndex: number | null,
  newItemName: string,
  newItemDescription: string,
  newItemPhoto: string | null,
  setNewItemPhoto: React.Dispatch<React.SetStateAction<string | null>>,
  newItemPricingType: "single" | "halfFull",
  newItemPrice: string,
  newItemHalfPrice: string,
  newItemFullPrice: string,
  newAddOnName: string,
  newAddOnPrice: string,
  additionalAddOns: { name: string; price: string }[],
  setSelectedAdminMenu: React.Dispatch<React.SetStateAction<any>>,
  setNewItemName: React.Dispatch<React.SetStateAction<string>>,
  setNewItemDescription: React.Dispatch<React.SetStateAction<string>>,
  setNewItemPrice: React.Dispatch<React.SetStateAction<string>>,
  setNewItemPricingType: React.Dispatch<
    React.SetStateAction<"single" | "halfFull">
  >,
  setNewItemHalfPrice: React.Dispatch<React.SetStateAction<string>>,
  setNewItemFullPrice: React.Dispatch<React.SetStateAction<string>>,
  setNewAddOnName: React.Dispatch<React.SetStateAction<string>>,
  setNewAddOnPrice: React.Dispatch<React.SetStateAction<string>>,
  setAdditionalAddOns: React.Dispatch<
    React.SetStateAction<{ name: string; price: string }[]>
  >,
  setNewItemCategoryIndex: React.Dispatch<React.SetStateAction<number | null>>,
  loadAdminMenus: () => Promise<void>,
) => {
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
    if (newItemPrice.trim() !== "" && (!Number.isFinite(price) || price < 0)) {
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
    // Generates the new item's ID before saving its photo
    const newItemId = doc(collection(db, "menuItemImages")).id;

    console.log("New menu item photo ID:", newItemId);

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
          id: newItemId,
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

    // Compresses and saves the new item's photo using its unique ID
    if (newItemPhoto) {
      const compressedPhoto = await compressMenuItemPhoto(newItemPhoto);
      await saveMenuItemPhoto(newItemId, compressedPhoto);
    }

    await updateDoc(doc(db, "menus", selectedAdminMenu.id), {
      categories: updatedCategories,
    });

    setSelectedAdminMenu({
      ...selectedAdminMenu,
      categories: updatedCategories,
    });

    setNewItemName("");
    setNewItemDescription("");
    setNewItemPhoto(null);
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
