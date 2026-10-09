import { doc, runTransaction } from 'firebase/firestore';
import { firestore } from '../../shared/infrastructure/firebase-client.js';
import { reconcileOffers } from '../domain/model/offer-policy.js';

export const registerWasteInFirestore = async ({ item, quantity, reason, ownerId, isSupplier }) => {
  const inventoryRef = doc(firestore, isSupplier ? 'supplierInventory' : 'inventory', item.id);
  const id = `waste-${crypto.randomUUID()}`;
  const wasteRef = doc(firestore, 'waste', id);
  const record = {
    id, ownerId, productName: item.productName, lotCode: item.lotCode,
    quantity, unit: 'units', reason, recordedAt: new Date().toISOString(),
  };
  const updated = await runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(inventoryRef);
    if (!snapshot.exists() || (isSupplier ? snapshot.data().supplierId : snapshot.data().minimarketId) !== ownerId) {
      throw new Error('inventory-changed');
    }
    const current = snapshot.data();
    const stock = Number(current.stock) - quantity;
    if (stock < 0) throw new Error('insufficient-stock');
    const changes = { stock, status: stock <= Number(current.minimumStock) ? 'risk' : 'healthy', offers: reconcileOffers(current.offers, stock) };
    transaction.update(inventoryRef, changes);
    transaction.set(wasteRef, record);
    return { ...current, ...changes };
  });
  return { record, updated };
};
