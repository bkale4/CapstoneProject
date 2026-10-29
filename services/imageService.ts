import * as ImagePicker from "expo-image-picker";

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
