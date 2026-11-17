

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBM8reWb13a25ttA2wYtnlGeStuUXqUyok",
  authDomain: "f2h-app-20d31.firebaseapp.com",
  databaseURL: "https://f2h-app-20d31-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "f2h-app-20d31",
  storageBucket: "f2h-app-20d31.firebasestorage.app",
  messagingSenderId: "721560940952",
  appId: "1:721560940952:web:b4d1c0e74b4188aff8bbed"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);