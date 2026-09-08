import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOUsUDdEpsC4fruVnteHRRStNE-8RmRX8",
  authDomain: "rootranchcatering.firebaseapp.com",
  projectId: "rootranchcatering",
  storageBucket: "rootranchcatering.firebasestorage.app",
  messagingSenderId: "135387657395",
  appId: "1:135387657395:web:a2260b956d9b72aa242cc6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
