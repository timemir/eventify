// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxVZNx4R64NqidPwgJvm84EwxMe1UKWhQ",
  authDomain: "eventify-43747.firebaseapp.com",
  databaseURL:
    "https://eventify-43747-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eventify-43747",
  storageBucket: "eventify-43747.appspot.com",
  messagingSenderId: "117828826169",
  appId: "1:117828826169:web:a314460a9d2ca05d1d09e8",
  measurementId: "G-80WZE7D96L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export { auth };

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
export { database };
