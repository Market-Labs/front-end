import { deleteApp, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, deleteUser, getAuth, inMemoryPersistence,
  setPersistence, signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseConfig, firestore } from '../../shared/infrastructure/firebase-client.js';

export const provisionFirebaseUser = async ({ name, email, password, role, roles, permissions, minimarketId, supplierId, tenantId, accessLevel, createdBy }) => {
  const secondaryApp = initializeApp(firebaseConfig, `marketgo-provision-${crypto.randomUUID()}`);
  const secondaryAuth = getAuth(secondaryApp);
  let createdUser;
  try {
    await setPersistence(secondaryAuth, inMemoryPersistence);
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    createdUser = credential.user;
    const record = {
      id: createdUser.uid,
      name, email, role, roles, permissions,
      status: 'active', minimarketId, supplierId, accessLevel, createdBy,
      ...(tenantId ? { tenantId } : {}),
    };
    await setDoc(doc(firestore, 'users', createdUser.uid), record);
    return record;
  } catch (error) {
    if (createdUser) {
      try {
        await deleteUser(createdUser);
      } catch {
        throw new Error('provisioning-cleanup-required', { cause: error });
      }
    }
    throw error;
  } finally {
    if (secondaryAuth.currentUser) await signOut(secondaryAuth);
    await deleteApp(secondaryApp);
  }
};
