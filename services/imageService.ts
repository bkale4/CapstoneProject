import * as ImagePicker from "expo-image-picker";

import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

// Opens the device's photo library and returns the selected image
export const selectMenuItemPhoto = async (): Promise<string | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 0.7,
  });

  // Returns null if the user cancels photo selection
  if (result.canceled || !result.assets?.length) {
    return null;
  }

  return result.assets[0].uri;
};

// Resizes and compresses a menu item photo before storing it in Firestore
export const compressMenuItemPhoto = async (
  imageUri: string,
): Promise<string> => {
  // Loads the selected image and limits its dimensions while preserving its proportions
  const context = ImageManipulator.manipulate(imageUri);

  // Resizes the image while maintaining its proporations
  context.resize({ width: 600, height: null });

  // Processes the image at the requested size
  const processedImage = await context.renderAsync();

  // Converts the compressed JPEG into Base64 data for Firestore storage
  const result = await processedImage.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.5,
    base64: true,
  });

  // Checks whether the compressed image was successfully converted to Base64
  console.log("Compressed image created:", !!result.base64);
  console.log("Base64 length:", result.base64?.length ?? 0);

  // Returns the compressed image data, or an empty string if conversion fails
  return result.base64 ?? "";
};
