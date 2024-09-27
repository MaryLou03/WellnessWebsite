// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYdjxd564ZQyiBP1EMdj_kTpQZbvt7NdU",
  authDomain: "wellnesswebsite-4565b.firebaseapp.com",
  projectId: "wellnesswebsite-4565b",
  storageBucket: "wellnesswebsite-4565b.appspot.com",
  messagingSenderId: "448365075222",
  appId: "1:448365075222:web:16415d6f0e0d5f3e058e37",
  measurementId: "G-04CEW99XH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);