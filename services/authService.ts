import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import type React from "react";
import { auth, db } from "../firebaseConfig";
import type { Screen } from "../types";

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
