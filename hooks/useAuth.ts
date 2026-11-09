import { useState } from "react";

import type { Dispatch, SetStateAction } from "react";

import type { Screen } from "../types/types";

import {
    handleBusinessLogin as handleBusinessLoginService,
    handleCreateAccount as handleCreateAccountService,
    handleCustomerLogin as handleCustomerLoginService,
} from "../services/authService";

// Manages customers and admin authentiation state
export const useAuth = (setScreen: Dispatch<SetStateAction<Screen>>) => {
  // Stores admin login credentials and messages
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  // Tracks guest checkout and customer registration information
  const [continueAsGuest, setContinueAsGuest] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPassword, setNewCustomerPassword] = useState("");
  const [createAccountMessage, setCreateAccountMessage] = useState("");
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false);

  // Stores customer login credentials and messages
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [customerLoginMessage, setCustomerLoginMessage] = useState("");

  // Stores the authenticated customer's contact information
  const [loggedInCustomerName, setLoggedInCustomerName] = useState("");
  const [loggedInCustomerPhone, setLoggedInCustomerPhone] = useState("");
  const [loggedInCustomerEmail, setLoggedInCustomerEmail] = useState("");

  // Stores contact information entered by guest customers
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Passes customer registration information to the authentication service
  const handleCreateAccount = async () => {
    await handleCreateAccountService(
      newCustomerName,
      newCustomerPhone,
      newCustomerEmail,
      newCustomerPassword,
      setLoggedInCustomerName,
      setLoggedInCustomerPhone,
      setLoggedInCustomerEmail,
      setCreateAccountMessage,
      setIsCustomerLoggedIn,
      setScreen,
    );
  };

  // Passes customer login information to the authentication service
  const handleCustomerLogin = async () => {
    await handleCustomerLoginService(
      customerEmail,
      customerPassword,
      setLoggedInCustomerName,
      setLoggedInCustomerPhone,
      setLoggedInCustomerEmail,
      setCustomerLoginMessage,
      setIsCustomerLoggedIn,
      setScreen,
    );
  };

  // Tracks whether the admin is currently logged in
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Passes administrator login information to the authentication service
  const handleBusinessLogin = async () => {
    await handleBusinessLoginService(
      adminUsername,
      adminPassword,
      setLoginMessage,
      setIsAdminLoggedIn,
      setScreen,
    );
  };

  return {
    adminUsername,
    setAdminUsername,
    adminPassword,
    setAdminPassword,
    loginMessage,
    setLoginMessage,
    continueAsGuest,
    setContinueAsGuest,
    newCustomerName,
    setNewCustomerName,
    newCustomerPhone,
    setNewCustomerPhone,
    newCustomerEmail,
    setNewCustomerEmail,
    newCustomerPassword,
    setNewCustomerPassword,
    createAccountMessage,
    setCreateAccountMessage,
    isCustomerLoggedIn,
    setIsCustomerLoggedIn,
    customerEmail,
    setCustomerEmail,
    customerPassword,
    setCustomerPassword,
    customerLoginMessage,
    setCustomerLoginMessage,
    loggedInCustomerName,
    setLoggedInCustomerName,
    loggedInCustomerPhone,
    setLoggedInCustomerPhone,
    loggedInCustomerEmail,
    setLoggedInCustomerEmail,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    guestEmail,
    setGuestEmail,
    handleCreateAccount,
    handleCustomerLogin,
    handleBusinessLogin,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
  };
};
