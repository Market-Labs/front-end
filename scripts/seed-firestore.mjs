import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = 'marketgo-d9c75';
const adminEmail = 'administrador@marketgo.com';
const supplierEmail = 'proveedor@marketgo.com';
const source = JSON.parse(readFileSync(fileURLToPath(new URL('../server/db.json', import.meta.url)), 'utf8'));
const apply = process.argv.includes('--apply');
const check = process.argv.includes('--check');
const collections = [
  'profiles', 'products', 'inventory', 'requisitions', 'purchaseOrders', 'waste',
  'retailSales', 'suppliers', 'conservationMonitoring', 'conservationAlerts',
  'notifications', 'supplierInventory', 'supplierConservationMonitoring',
  'supplierAlerts', 'activityHistory',
];

if (!apply && !check) {
  for (const name of collections) console.log(`${name}: ${source[name]?.length || 0}`);
  console.log('users: 2 Firebase Auth accounts required; authAccounts/passwords are never imported.');
  console.log('Dry run only. Set GOOGLE_CLOUD_PROJECT=marketgo-d9c75 and use --apply to import.');
  process.exit(0);
}

if (process.env.GOOGLE_CLOUD_PROJECT !== projectId) {
  throw new Error(`Set GOOGLE_CLOUD_PROJECT=${projectId} before importing.`);
}

const accessToken = process.env.MARKETGO_FIREBASE_ACCESS_TOKEN;
if (!accessToken) initializeApp({ credential: applicationDefault(), projectId });

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok && response.status !== 409) {
    throw new Error(`${response.status} ${url}: ${(await response.text()).slice(0, 300)}`);
  }
  return response;
};

const findAccounts = async () => {
  if (!accessToken) {
    const auth = getAuth();
    return Promise.all([auth.getUserByEmail(adminEmail), auth.getUserByEmail(supplierEmail)]);
  }
  const accounts = [];
  let pageToken;
  do {
    const url = new URL(`https://identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:batchGet`);
    url.searchParams.set('maxResults', '1000');
    if (pageToken) url.searchParams.set('nextPageToken', pageToken);
    const response = await requestJson(url);
    const body = await response.json();
    accounts.push(...(body.users || []));
    pageToken = body.nextPageToken;
  } while (pageToken);
  return [adminEmail, supplierEmail].map((email) => {
    const account = accounts.find((entry) => entry.email?.toLowerCase() === email);
    if (!account) throw new Error(`Missing Firebase Authentication account: ${email}`);
    return { uid: account.localId };
  });
};

const [adminAccount, supplierAccount] = await findAccounts();
console.log('Both Firebase Authentication accounts are available.');
if (check) console.log('Read-only check complete.');
const idMap = new Map([
  ['usr-admin', adminAccount.uid],
  ['usr-provider', supplierAccount.uid],
]);

const replaceUserIds = (value) => {
  if (Array.isArray(value)) return value.map(replaceUserIds);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceUserIds(item)]));
  }
  if (value === 'admi@marketgo.com') return adminEmail;
  return idMap.get(value) || value;
};

const userRecords = source.users.map((user) => ({
  ...user,
  id: idMap.get(user.id),
  email: user.id === 'usr-admin' ? adminEmail : supplierEmail,
  role: user.id === 'usr-admin' ? 'admin' : 'supplier',
  minimarketId: user.id === 'usr-admin' ? 'min-1' : null,
  supplierId: user.id === 'usr-provider' ? 'sup-2' : null,
  permissions: user.id === 'usr-provider' ? [...user.permissions, 'users:manage'] : user.permissions,
}));

const withScope = (name, record) => {
  const data = replaceUserIds(record);
  if (['inventory', 'retailSales', 'conservationMonitoring', 'conservationAlerts', 'notifications', 'activityHistory'].includes(name)) {
    data.minimarketId = 'min-1';
  }
  if (['supplierInventory', 'supplierConservationMonitoring', 'supplierAlerts'].includes(name)) {
    data.supplierId = 'sup-2';
  }
  if (name === 'profiles') data.minimarketId = 'min-1';
  return data;
};

const createIfMissing = async (collectionName, id, data) => {
  if (!accessToken) {
    const ref = getFirestore().collection(collectionName).doc(id);
    if ((await ref.get()).exists) return false;
    await ref.create(data);
    return true;
  }
  const url = new URL(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}`);
  url.searchParams.set('documentId', id);
  const response = await requestJson(url, {
    method: 'POST', body: JSON.stringify({ fields: Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, toFirestoreValue(value)]),
    ) }),
  });
  return response.status !== 409;
};

const toFirestoreValue = (value) => {
  if (value === null) return { nullValue: null };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value)
    ? { integerValue: String(value) } : { doubleValue: value };
  if (typeof value === 'string') return { stringValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  return { mapValue: { fields: Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, toFirestoreValue(entry)]),
  ) } };
};

if (apply) {
  let created = 0;
  for (const user of userRecords) {
    if (await createIfMissing('users', user.id, user)) created += 1;
  }
  for (const name of collections) {
    for (const record of source[name] || []) {
      const data = withScope(name, record);
      if (await createIfMissing(name, String(data.id), data)) created += 1;
    }
  }
  for (const name of ['dashboard', 'supplierDashboard', 'analytics', 'supplierAnalytics']) {
    if (await createIfMissing('summaries', name, replaceUserIds(source[name]))) created += 1;
  }
  console.log(`Created ${created} documents in ${projectId}; existing documents were not overwritten.`);
}
