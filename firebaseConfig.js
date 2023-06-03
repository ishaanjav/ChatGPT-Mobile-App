// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyABjEBXf2d0weNXJGN6g2os0J26iRL4zC0",
    authDomain: "chatgpt-mobile-app-52f2b.firebaseapp.com",
    databaseURL: "https://chatgpt-mobile-app-52f2b-default-rtdb.firebaseio.com",
    projectId: "chatgpt-mobile-app-52f2b",
    storageBucket: "chatgpt-mobile-app-52f2b.appspot.com",
    messagingSenderId: "336566510800",
    appId: "1:336566510800:web:f43a5922d8da4e14b0aad5",
    measurementId: "G-CM390MLCP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);