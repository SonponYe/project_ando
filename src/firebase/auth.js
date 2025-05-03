// src/firebase/auth.js
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Redirect error:", error.message);
  }
};

export const handleRedirectResult = async () => {
  try {
    console.log("Checking for redirect result...");
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Redirect result user:", result.user);
      return result.user;
    } else {
      console.log("No redirect result found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving redirect result:", error.message);
    return null;
  }
};

export const logout = () => signOut(auth);

export const onAuthStateChanged = (callback) =>
  firebaseOnAuthStateChanged(auth, callback);
