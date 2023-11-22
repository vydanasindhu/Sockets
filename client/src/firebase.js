import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Add this line

const firebaseConfig = {
  apiKey: "AIzaSyC16we0mmgf0Whyld-geDoRUBZhuEkKsZc",

  authDomain: "cs567-cfe2c.firebaseapp.com",

  projectId: "cs567-cfe2c",

  storageBucket: "cs567-cfe2c.appspot.com",

  messagingSenderId: "703194941153",

  appId: "1:703194941153:web:7138937786c61d71b899a0",

  measurementId: "G-V5M7HFBB7G"

};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore };
