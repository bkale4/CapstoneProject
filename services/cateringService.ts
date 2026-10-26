import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Screen } from "../types";

// Saves a catering request to Firestore
export const submitCateringRequest = async (
  cateringCustomerName: string,
  cateringContact: string,
  selectedCateringDate: string,
  cateringTime: string,
  cateringGuestCount: string,
  cateringMenuPreferences: string,
  cateringVenueName: string,
  cateringVenueAddress: string,
  cateringNotes: string,
  setScreen: (screen: Screen) => void,
) => {
  try {
    await addDoc(collection(db, "cateringRequests"), {
      customerName: cateringCustomerName,
      contactInformation: cateringContact,
      date: selectedCateringDate,
      time: cateringTime,
      guestCount: Number(cateringGuestCount),
      menuPreferences: cateringMenuPreferences,
      venueName: cateringVenueName,
      venueAddress: cateringVenueAddress,
      specialNotes: cateringNotes,
      status: "pending",
      createdAt: new Date(),
    });

    console.log("Catering request saved to Firebase");

    setScreen("cateringConfirmation");
  } catch (error) {
    console.error("Error saving catering request:", error);
  }
};
