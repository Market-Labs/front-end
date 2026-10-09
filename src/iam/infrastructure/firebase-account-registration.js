import { createUserWithEmailAndPassword, deleteUser, updateProfile } from 'firebase/auth';
import { doc, writeBatch } from 'firebase/firestore';
import { firebaseAuth, firestore } from '../../shared/infrastructure/firebase-client.js';

const ownerPermissions = {
  admin: ['inventory:write', 'procurements:approve', 'users:manage'],
  supplier: ['products:write', 'procurements:track', 'users:manage'],
};

export const registerFirebaseAccount = async ({ type, name, email, businessName, password }) => {
  if (!['admin', 'supplier'].includes(type)) throw new Error('invalid-account-type');
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  const { uid } = credential.user;
  const minimarketId = type === 'admin' ? `min-${uid}` : null;
  const supplierId = type === 'supplier' ? `sup-${uid}` : null;
  const tenantId = uid;
  const user = {
    id: uid, name, email, role: type,
    roles: [type === 'admin' ? 'Administrador de Minimarket' : 'Proveedor Organico'],
    permissions: ownerPermissions[type], status: 'active',
    minimarketId, supplierId, tenantId, accessLevel: 'owner', createdBy: null,
  };
  const profile = {
    id: `prof-${uid}`, userId: uid, tenantId,
    type: type === 'admin' ? 'minimarket' : 'provider',
    businessName, email, phone: '', address: '', district: '', specialty: '', coverageArea: '',
    minimarketId, supplierId,
  };
  const organization = { id: uid, ownerUid: uid, type, name: businessName, minimarketId, supplierId };
  try {
    const batch = writeBatch(firestore);
    batch.set(doc(firestore, 'organizations', uid), organization);
    batch.set(doc(firestore, 'users', uid), user);
    batch.set(doc(firestore, 'organizations', uid, 'profiles', profile.id), profile);
    if (type === 'supplier') {
      batch.set(doc(firestore, 'organizations', uid, 'suppliers', supplierId), {
        id: supplierId, businessName, email, ruc: '', phone: '', address: '',
        specialty: '', coverageArea: '', status: 'active', tenantId,
      });
    }
    await batch.commit();
  } catch (error) {
    try {
      await deleteUser(credential.user);
    } catch {
      throw new Error('signup-cleanup-required', { cause: error });
    }
    throw error;
  }
  try { await updateProfile(credential.user, { displayName: name }); } catch { /* Firestore profile is authoritative. */ }
  return user;
};
