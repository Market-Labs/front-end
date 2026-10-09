import {
  collection, deleteDoc, doc, getDoc, getDocs, query, runTransaction, updateDoc, where,
} from 'firebase/firestore';
import { apiEndpoints } from './api-endpoints.js';
import { firebaseAuth, firestore } from './firebase-client.js';

const routes = new Map([
  [apiEndpoints.users, 'users'],
  [apiEndpoints.profiles, 'profiles'],
  [apiEndpoints.dashboard, 'dashboard'],
  [apiEndpoints.supplierDashboard, 'supplierDashboard'],
  [apiEndpoints.analytics, 'analytics'],
  [apiEndpoints.supplierAnalytics, 'supplierAnalytics'],
  [apiEndpoints.products, 'products'],
  [apiEndpoints.supplierProducts, 'products'],
  [apiEndpoints.inventory, 'inventory'],
  [apiEndpoints.supplierInventory, 'supplierInventory'],
  [apiEndpoints.inventorySearch, 'inventory'],
  [apiEndpoints.requisitions, 'requisitions'],
  [apiEndpoints.procurements, 'purchaseOrders'],
  [apiEndpoints.suppliers, 'suppliers'],
  [apiEndpoints.conservationMonitoring, 'conservationMonitoring'],
  [apiEndpoints.supplierConservationMonitoring, 'supplierConservationMonitoring'],
  [apiEndpoints.conservationAlerts, 'conservationAlerts'],
  [apiEndpoints.notifications, 'notifications'],
  [apiEndpoints.supplierAlerts, 'supplierAlerts'],
  [apiEndpoints.activityHistory, 'activityHistory'],
  [apiEndpoints.waste, 'waste'],
  [apiEndpoints.supplierWaste, 'waste'],
]);

const singletonResources = new Set([
  'dashboard', 'supplierDashboard', 'analytics', 'supplierAnalytics',
]);

const emptyRoutes = new Set([apiEndpoints.lots, apiEndpoints.expirations, apiEndpoints.donations]);
const payloadFrom = (data) => typeof data === 'string' ? JSON.parse(data) : data;

const currentProfile = async () => {
  const uid = firebaseAuth.currentUser?.uid;
  if (!uid) throw new Error('unauthenticated');
  const snapshot = await getDoc(doc(firestore, 'users', uid));
  if (!snapshot.exists() || snapshot.data().status !== 'active') throw new Error('access-denied');
  return { uid, ...snapshot.data() };
};

const listQuery = (resource, profile) => {
  const ref = collection(firestore, resource);
  const supplier = profile.role === 'supplier';
  if (resource === 'users') return query(ref, where(supplier ? 'supplierId' : 'minimarketId', '==', supplier ? profile.supplierId : profile.minimarketId));
  if (resource === 'suppliers') return supplier ? query(ref, where('id', '==', profile.supplierId)) : ref;
  if (resource === 'products' && supplier) return query(ref, where('supplierId', '==', profile.supplierId));
  if (resource === 'requisitions' || resource === 'purchaseOrders') {
    return query(ref, where(supplier ? 'supplierId' : 'minimarketId', '==', supplier ? profile.supplierId : profile.minimarketId));
  }
  if (resource === 'waste') return query(ref, where('ownerId', '==', supplier ? profile.supplierId : profile.minimarketId));
  if (resource === 'inventory' || resource === 'notifications' || resource === 'conservationAlerts' || resource === 'activityHistory' || resource === 'conservationMonitoring') {
    return query(ref, where('minimarketId', '==', profile.minimarketId));
  }
  if (resource === 'supplierInventory' || resource === 'supplierAlerts' || resource === 'supplierConservationMonitoring') {
    return query(ref, where('supplierId', '==', profile.supplierId));
  }
  return ref;
};

export const firestoreAdapter = async (config) => {
  const method = config.method?.toLowerCase() || 'get';
  const path = config.url.replace(/^\/+/, '').split('?')[0];
  if (path === apiEndpoints.health && method === 'get') {
    return { data: { status: 'ok' }, status: 200, statusText: 'OK', headers: {}, config };
  }
  if (emptyRoutes.has(path) && method === 'get') {
    return { data: [], status: 200, statusText: 'OK', headers: {}, config };
  }

  const route = [...routes.keys()].sort((a, b) => b.length - a.length)
    .find((entry) => path === entry || path.startsWith(`${entry}/`));
  if (!route) throw new Error(`Unknown Firestore route: ${path}`);
  const resource = routes.get(route);
  const id = path === route ? null : decodeURIComponent(path.slice(route.length + 1));
  const profile = await currentProfile();
  const ref = id ? doc(firestore, resource, id) : null;
  let data;

  if (method === 'get') {
    if (singletonResources.has(resource)) {
      const snapshot = await getDoc(doc(firestore, 'summaries', resource));
      if (!snapshot.exists()) throw new Error(`Missing summary: ${resource}`);
      data = snapshot.data();
    } else if (id) {
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) throw new Error(`Missing document: ${path}`);
      data = { ...snapshot.data(), id: snapshot.id };
    } else {
      const selected = route === apiEndpoints.supplierProducts
        ? query(collection(firestore, 'products'), where('supplierId', '==', profile.supplierId))
        : listQuery(resource, profile);
      const snapshot = await getDocs(selected);
      data = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }));
    }
  } else if (method === 'post' && !id && !singletonResources.has(resource)) {
    const payload = payloadFrom(config.data);
    if (!payload.id) throw new Error('missing-id');
    if (resource === 'inventory') payload.minimarketId = profile.minimarketId;
    if (resource === 'supplierInventory') payload.supplierId = profile.supplierId;
    const target = doc(firestore, resource, String(payload.id));
    await runTransaction(firestore, async (transaction) => {
      if ((await transaction.get(target)).exists()) throw new Error('duplicate-id');
      transaction.set(target, payload);
    });
    data = payload;
  } else if (method === 'patch' && id && !singletonResources.has(resource)) {
    await updateDoc(ref, payloadFrom(config.data));
    const snapshot = await getDoc(ref);
    data = { ...snapshot.data(), id: snapshot.id };
  } else if (method === 'delete' && id && !singletonResources.has(resource)) {
    await deleteDoc(ref);
    data = null;
  } else {
    throw new Error(`Unsupported Firestore operation: ${method} ${path}`);
  }

  return { data, status: 200, statusText: 'OK', headers: {}, config };
};
