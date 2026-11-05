import { useEffect, useState } from "react";

// Imports types for updating application navigation
import type { Dispatch, SetStateAction } from "react";
import type { Screen } from "../types";

// Imports the service for retrieving catering requests from Firestore
import {
    loadCateringRequests as loadCateringRequestsService,
    submitCateringRequest as submitCateringRequestService,
    updateCateringFollowUp as updateCateringFollowUpService,
} from "../services/cateringService";

// Imports services for updating catering requests and refreshing availability
import {
    loadAvailability as loadAvailabilityService,
    toggleAvailability as toggleAvailabilityService,
    updateCateringRequestStatus as updateCateringRequestStatusService,
} from "../services/cateringService";

// Manages catering requests and availability information
export const useCatering = (setScreen: Dispatch<SetStateAction<Screen>>) => {
  // Stores customer catering requests retrieved from Firestore
  const [cateringRequests, setCateringRequests] = useState<any[]>([]);

  // Stores catering availability by date using Firestore data
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  // Stores customer information for catering requests
  const [cateringCustomerName, setCateringCustomerName] = useState("");
  const [cateringContact, setCateringContact] = useState("");

  // Tracks the selected catering date and event time
  const [selectedCateringDate, setSelectedCateringDate] = useState<string>("");
  const [cateringTime, setCateringTime] = useState("");

  // Stores the catering guest count and menu preferences
  const [cateringGuestCount, setCateringGuestCount] = useState("");
  const [cateringMenuPreferences, setCateringMenuPreferences] = useState("");

  // Stores the catering event's venue information
  const [cateringVenueName, setCateringVenueName] = useState("");
  const [cateringVenueAddress, setCateringVenueAddress] = useState("");

  // Stores additional notes provided by the customer
  const [cateringNotes, setCateringNotes] = useState("");

  // Loads customer catering requests through the catering service
  const loadCateringRequests = async () => {
    await loadCateringRequestsService(setCateringRequests);
  };

  // Updates a catering request's status and refreshes the admin request list
  const updateCateringRequestStatus = async (
    requestId: string,
    status: "accepted" | "rejected",
  ) => {
    try {
      await updateCateringRequestStatusService(requestId, status);
      await loadCateringRequests();

      // Refreshes calendar availability after a catering request status changes
      await loadAvailabilityService(setAvailability);
    } catch (error) {
      console.error("Unable to update catering request:", error);
    }
  };

  // Saves catering follow-up information and refreshes the request list
  const updateCateringFollowUp = async (
    requestId: string,
    followUpNeeded: boolean,
    followUpNotes: string,
  ) => {
    try {
      await updateCateringFollowUpService(
        requestId,
        followUpNeeded,
        followUpNotes,
      );

      await loadCateringRequests();
    } catch (error) {
      console.error("Unable to update catering follow-up:", error);
      throw error;
    }
  };

  // Loads catering availability when the app starts
  useEffect(() => {
    loadAvailabilityService(setAvailability);
  }, []);

  // Passes catering availability changes to the catering service
  const toggleAvailability = async (dateKey: string) => {
    await toggleAvailabilityService(dateKey, availability, setAvailability);
  };

  // Passes the catering request information to the catering service
  const submitCateringRequest = async () => {
    await submitCateringRequestService(
      cateringCustomerName,
      cateringContact,
      selectedCateringDate,
      cateringTime,
      cateringGuestCount,
      cateringMenuPreferences,
      cateringVenueName,
      cateringVenueAddress,
      cateringNotes,
      setScreen,
    );
  };

  return {
    cateringRequests,
    setCateringRequests,
    availability,
    setAvailability,
    cateringCustomerName,
    setCateringCustomerName,
    cateringContact,
    setCateringContact,
    selectedCateringDate,
    setSelectedCateringDate,
    cateringTime,
    setCateringTime,
    cateringGuestCount,
    setCateringGuestCount,
    cateringMenuPreferences,
    setCateringMenuPreferences,
    cateringVenueName,
    setCateringVenueName,
    cateringVenueAddress,
    setCateringVenueAddress,
    cateringNotes,
    setCateringNotes,
    loadCateringRequests,
    updateCateringRequestStatus,
    updateCateringFollowUp,
    toggleAvailability,
    submitCateringRequest,
  };
};
