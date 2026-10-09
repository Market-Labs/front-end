import { doc, runTransaction } from 'firebase/firestore';
import { firestore } from '../../shared/infrastructure/firebase-client.js';
import { reconcileOffers } from '../domain/model/offer-policy.js';

export const registerStockOutputInFirestore = async ({ item, quantity, ownerId, movement }) => {
  const inventoryRef = doc(firestore, 'inventory', item.id);
  return runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(inventoryRef);
    if (!snapshot.exists() || snapshot.data().minimarketId !== ownerId) {
      throw new Error('inventory-changed');
    }
    const current = snapshot.data();
    const stock = Number(current.stock) - quantity;
    if (stock < 0) throw new Error('insufficient-stock');
    const changes = {
      stock,
      status: stock <= Number(current.minimumStock) ? 'risk' : 'healthy',
      stockUpdates: [...(current.stockUpdates || []), movement],
      offers: reconcileOffers(current.offers, stock),
    };
    transaction.update(inventoryRef, changes);
    return { ...current, ...changes };
  });
};
