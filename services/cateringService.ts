import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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

// Updates catering availability in Firestore
export const toggleAvailability = async (
  dateKey: string,
  availability: Record<string, boolean>,
  setAvailability: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
) => {
  const newAvailability = availability[dateKey] === false;

  setAvailability((prev) => ({
    ...prev,
    [dateKey]: newAvailability,
  }));

  try {
    await setDoc(doc(db, "availability", dateKey), {
      date: dateKey,
      available: newAvailability,
    });

    console.log("Availability saved:", dateKey, newAvailability);
  } catch (error) {
    console.error("Error saving availability:", error);
  }
};

// Loads catering availability from Firestore
export const loadAvailability = async (
  setAvailability: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
) => {
  try {
    const querySnapshot = await getDocs(collection(db, "availability"));

    const savedAvailability: Record<string, boolean> = {};

    querySnapshot.forEach((document) => {
      const data = document.data();

      savedAvailability[document.id] = data.available;
    });

    setAvailability(savedAvailability);
    console.log("Availability loaded from Firebase");
  } catch (error) {
    console.error("Error loading availability:", error);
  }
};

// Loads customer catering requests from Firestore for admin
export const loadCateringRequests = async (
  setCateringRequests: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  try {
    const requestsQuery = query(
      collection(db, "cateringRequests"),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(requestsQuery);

    const requests = querySnapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    }));
    setCateringRequests(requests);
  } catch (error) {
    console.error("Error loading catering requests:", error);
  }
};

// Updates a catering request's accpetance status in Firestore
export const updateCateringRequestStatus = async (
  requestId: string,
  status: "accepted" | "rejected",
) => {
  try {
    await updateDoc(doc(db, "cateringRequests", requestId), {
      status: status,
    });

    console.log("Catering request status updated:", requestId, status);
  } catch (error) {
    console.error("Error updating a catering request status:", error);
    throw error;
  }
};

// Saves admin follow-up information for a catering request
export const updateCateringFollowUp = async (
  requestId: string,
  followUpNeeded: boolean,
  followUpNotes: string,
) => {
  try {
    await updateDoc(doc(db, "cateringRequests", requestId), {
      followUpNeeded: followUpNeeded,
      followUpNotes: followUpNotes,
    });

    console.log("Catering follow-up updated:", requestId);
  } catch (error) {
    console.error("Error updating catering follow-up:", error);
    throw error;
  }
};
