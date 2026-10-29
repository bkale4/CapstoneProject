import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import type React from "react";
import { auth, db } from "../firebaseConfig";
import type { Screen } from "../types";

import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc } from "firebase/firestore";

// Creates a customer account and saves their information to Firestore
export const handleCreateAccount = async (
  newCustomerName: string,
  newCustomerPhone: string,
  newCustomerEmail: string,
  newCustomerPassword: string,
  setLoggedInCustomerName: React.Dispatch<React.SetStateAction<string>>,
  setLoggedInCustomerPhone: React.Dispatch<React.SetStateAction<string>>,
  setLoggedInCustomerEmail: React.Dispatch<React.SetStateAction<string>>,
  setCreateAccountMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsCustomerLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setScreen: (screen: Screen) => void,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newCustomerEmail,
      newCustomerPassword,
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: newCustomerName,
      phone: newCustomerPhone,
      email: newCustomerEmail,
      role: "customer",
    });

    setLoggedInCustomerName(newCustomerName);
    setLoggedInCustomerPhone(newCustomerPhone);
    setLoggedInCustomerEmail(newCustomerEmail);

    setCreateAccountMessage("");
    setIsCustomerLoggedIn(true);
    setScreen("checkout");
  } catch (error) {
    setCreateAccountMessage(
      "Unable to create account. Please check your information.",
    );
  }
};

// Authenticates a customer and loads their account information
export const handleCustomerLogin = async (
  customerEmail: string,
  customerPassword: string,
  setLoggedInCustomerName: React.Dispatch<React.SetStateAction<string>>,
  setLoggedInCustomerPhone: React.Dispatch<React.SetStateAction<string>>,
  setLoggedInCustomerEmail: React.Dispatch<React.SetStateAction<string>>,
  setCustomerLoginMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsCustomerLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setScreen: (screen: Screen) => void,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      customerEmail,
      customerPassword,
    );

    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (userDoc.exists() && userDoc.data().role === "customer") {
      const customerData = userDoc.data();

      setLoggedInCustomerName(customerData.name || "");
      setLoggedInCustomerPhone(customerData.phone || "");
      setLoggedInCustomerEmail(customerData.email || "");

      setCustomerLoginMessage("");
      setIsCustomerLoggedIn(true);
      setScreen("checkout");
    } else {
      setCustomerLoginMessage(
        "Access Denied. This account is not a customer account.",
      );
    }
  } catch (error) {
    setCustomerLoginMessage("Invalid email or password.");
  }
};

// Authenticates an administrator and opens the Business Dashboard
export const handleBusinessLogin = async (
  adminUsername: string,
  adminPassword: string,
  setLoginMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setScreen: (screen: Screen) => void,
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      adminUsername,
      adminPassword,
    );

    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (userDoc.exists() && userDoc.data().role === "admin") {
      setLoginMessage("");
      setIsAdminLoggedIn(true);
      setScreen("business");
    } else {
      setLoginMessage("Access Denied. This area is for admin use only.");
    }
  } catch (error) {
    setLoginMessage("Access Denied. Please check your email and password.");
  }
};
