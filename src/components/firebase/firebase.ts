import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase-config';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// In locale (dev) leggi dallo stesso Firestore emulato condiviso da tutti i
// progetti cncbeauty-ce; in produzione resta il Firestore reale.
if (location.hostname === 'localhost') {
  console.info('[Firebase] Uso emulatore Firestore locale');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
