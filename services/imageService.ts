import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";

// Imports the Firebase database connection
import { db } from "../firebaseConfig";

import * as ImagePicker from "expo-image-picker";

import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// Opens the device's photo library and returns the selected image
export const selectMenuItemPhoto = async (): Promise<string[] | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    quality: 0.7,
  });

  // Returns null if the user cancels photo selection
  if (result.canceled || !result.assets?.length) {
    return null;
  }

  return result.assets.map((asset) => asset.uri);
};

// Resizes and compresses a menu item photo before storing it in Firestore
export const compressMenuItemPhoto = async (
  imageUri: string,
): Promise<string> => {
  // Loads the selected image and limits its dimensions while preserving its proportions
  const context = ImageManipulator.manipulate(imageUri);

  // Resizes the image while maintaining its proporations
  context.resize({ width: 600 });

  // Processes the image at the requested size
  const processedImage = await context.renderAsync();

  // Converts the compressed JPEG into Base64 data for Firestore storage
  const result = await processedImage.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.5,
    base64: true,
  });

  // Returns the compressed image data, or an empty string if conversion fails
  return result.base64 ?? "";
};

// Saves a compressed menu item photo to its own Firestore document
export const saveMenuItemPhoto = async (
  photoId: string,
  base64Image: string,
): Promise<void> => {
  // Ensures the image is small enough for a Firestore document
  const estimatedBytes = Math.ceil((base64Image.length * 3) / 4);

  if (!base64Image || estimatedBytes > 200_000) {
    throw new Error(
      "The photo is too large to save. Please select a smaller image.",
    );
  }

  // Saves the image separately from the existing menu documents
  await setDoc(doc(db, "menuItemImages", photoId), {
    imageData: base64Image,
    updatedAt: new Date().toISOString(),
  });
};

// Retrieves a previously saved menu item photo from Firestore
export const loadMenuItemPhoto = async (
  photoId: string,
): Promise<string | null> => {
  // Finds the photo document associated with the menu item
  const photoDoc = await getDoc(doc(db, "menuItemImages", photoId));

  // Returns null if the menu item does not have a saved photo
  if (!photoDoc.exists()) {
    return null;
  }

  // Converts the stored Base64 data into a displayable image URI
  const imageData = photoDoc.data().imageData;

  return typeof imageData === "string" && imageData
    ? `data:image/jpeg;base64,${imageData}`
    : null;
};

// Deletes a menu item's saved photo from Firestore
export const deleteMenuItemPhoto = async (photoId: string): Promise<void> => {
  // Removes the photo document associateed with the menu item
  await deleteDoc(doc(db, "menuItemImages", photoId));
};
