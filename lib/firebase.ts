// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA0A5BjE0q3SkTgJ2gEK-IGd-PBNrgbxMQ',
  authDomain: 'vintage-finds.firebaseapp.com',
  projectId: 'vintage-finds',
  storageBucket: 'vintage-finds.appspot.com',
  messagingSenderId: '954591621495',
  appId: '1:954591621495:web:701634070ae40290393172',
  measurementId: 'G-1KFDB44KYC',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
