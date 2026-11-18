
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";

import {
  initializeAuth,
  getAuth,
  type Auth,
} from "firebase/auth";

import {
  getDatabase,
} from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBM8reWb13a25ttA2wYtnlGeStuUXqUyok",
  authDomain: "f2h-app-20d31.firebaseapp.com",
  databaseURL:
    "https://f2h-app-20d31-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "f2h-app-20d31",
  storageBucket: "f2h-app-20d31.firebasestorage.app",
  messagingSenderId: "721560940952",
  appId: "1:721560940952:web:b4d1c0e74b4188aff8bbed",
};

// Initialize Firebase App
const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
let authInstance: Auth;

if (Platform.OS === "web") {
  authInstance = getAuth(app);
} else {
  try {
    // Use React Native persistent authentication
    const { getReactNativePersistence } = require(
      "@firebase/auth"
    );

    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Fallback if Auth was already initialized
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;

// Initialize Firebase Realtime Database
export const db = getDatabase(app);

export default app;
