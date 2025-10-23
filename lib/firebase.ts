// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA0A5BjE0q3SkTgJ2gEK-IGd-PBNrgbxMQ',
  authDomain: 'vintage-finds.firebaseapp.com',
  databaseURL: 'https://vintage-finds-default-rtdb.firebaseio.com',
  projectId: 'vintage-finds',
  storageBucket: 'vintage-finds.appspot.com',
  messagingSenderId: '954591621495',
  appId: '1:954591621495:web:701634070ae40290393172',
  measurementId: 'G-1KFDB44KYC',
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
