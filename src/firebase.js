import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASiFTpZS6pUjEet0-fkZgAQWi8eRpdnwE",
  authDomain: "mernisnotmerning.firebaseapp.com",
  databaseURL: "https://mernisnotmerning-default-rtdb.firebaseio.com",
  projectId: "mernisnotmerning",
  storageBucket: "mernisnotmerning.firebasestorage.app",
  messagingSenderId: "1006827687734",
  appId: "1:1006827687734:web:189ed8a0b3e9622098ed97"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
