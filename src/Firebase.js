import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyBNZMN7h22Tbs2TcTgDlOkRgANNmjjPPzU",
  authDomain: "seniorproject-1ed7d.firebaseapp.com",
  projectId: "seniorproject-1ed7d",
  storageBucket: "seniorproject-1ed7d.appspot.com",
  messagingSenderId: "719951366734",
  appId: "1:719951366734:web:0a013fc5c910cb326b511f",
  measurementId: "G-PE6VPJYD7Y",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getFirestore(app)
export { app, auth, db }
