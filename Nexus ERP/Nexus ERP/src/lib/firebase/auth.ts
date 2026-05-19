import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, type User } from "firebase/auth";
import { app } from "./index";

export const auth = getAuth(app);

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function register(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
