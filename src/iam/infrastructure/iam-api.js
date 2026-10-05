import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { UserAssembler } from './user.assembler.js';
import { browserLocalPersistence, browserSessionPersistence, setPersistence, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore, isFirebaseMode } from '../../shared/infrastructure/firebase-client.js';
import { provisionFirebaseUser } from './firebase-user-provisioning.js';

export class IamApi extends BaseApi {
  async signIn(credentials) {
    if (isFirebaseMode) {
      await setPersistence(firebaseAuth, credentials.remember ? browserLocalPersistence : browserSessionPersistence);
      let authenticated;
      try {
        authenticated = await signInWithEmailAndPassword(firebaseAuth, credentials.email, credentials.password);
      } catch {
        throw new Error('invalid-credentials');
      }
      let snapshot;
      try {
        snapshot = await getDoc(doc(firestore, 'users', authenticated.user.uid));
      } catch (error) {
        await signOut(firebaseAuth);
        throw error;
      }
      if (!snapshot.exists() || snapshot.data().status !== 'active') {
        await signOut(firebaseAuth);
        throw new Error('access-denied');
      }
      return { user: UserAssembler.toEntity({ ...snapshot.data(), id: snapshot.id }) };
    }
    const response = await this.http.get(`${apiEndpoints.auth}/accounts`);
    const account = response.data.find((entry) => (
      entry.email.toLowerCase() === credentials.email && entry.password === credentials.password
    ));
    if (!account) throw new Error('invalid-credentials');
    return { userId: account.userId };
  }

  async signUp(payload) {
    if (isFirebaseMode) throw new Error('admin-provisioning-required');
    const response = await this.http.post(`${apiEndpoints.auth}/sign-up`, payload);
    return response.data;
  }

  async getUsers() {
    const response = await this.http.get(apiEndpoints.users);
    return response.data.map(UserAssembler.toEntity);
  }
  async createUser(data) {
    if (!isFirebaseMode) throw new Error('firebase-required');
    const record = await provisionFirebaseUser(data);
    return UserAssembler.toEntity(record);
  }
  async updateUser(id, changes) {
    if (isFirebaseMode && changes.roles) {
      changes = { ...changes, role: changes.roles.includes('Administrador de Minimarket') ? 'admin' : 'supplier' };
    }
    const response = await this.http.patch(`${apiEndpoints.users}/${encodeURIComponent(id)}`, changes);
    return UserAssembler.toEntity(response.data);
  }
}
