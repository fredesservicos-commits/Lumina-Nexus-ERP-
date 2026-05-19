import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDy-mIIe3ITRJ6OO--S4T3XFQN2_AKbQd0",
  authDomain: "lumina-nexus-erp.firebaseapp.com",
  projectId: "lumina-nexus-erp",
  storageBucket: "lumina-nexus-erp.firebasestorage.app",
  messagingSenderId: "703891004008",
  appId: "1:703891004008:web:d29367043438fec6aab9dd",
  measurementId: "G-E43HQN5ENL",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
