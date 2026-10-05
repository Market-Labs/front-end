import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const isFirebaseMode = import.meta.env.VITE_DATA_SOURCE === 'firebase';

export const firebaseConfig = {
  apiKey: 'AIzaSyAKcuohZ8np9AOkWjh1VQ_lN8QJyvOZSAE',
  authDomain: 'marketgo-d9c75.firebaseapp.com',
  projectId: 'marketgo-d9c75',
  storageBucket: 'marketgo-d9c75.firebasestorage.app',
  messagingSenderId: '815615817745',
  appId: '1:815615817745:web:5fe186d602bee7b014d9b0',
};

const app = isFirebaseMode ? initializeApp(firebaseConfig) : null;

export const firebaseAuth = app ? getAuth(app) : null;
export const firestore = app ? getFirestore(app) : null;
