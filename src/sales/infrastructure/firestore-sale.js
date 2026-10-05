import { doc, runTransaction } from 'firebase/firestore';
import { firestore } from '../../shared/infrastructure/firebase-client.js';

export const createRetailSaleInFirestore = async (data, allocations) => {
  const id = `sale-${crypto.randomUUID()}`;
  const sale = { ...data, id };
  const saleRef = doc(firestore, 'retailSales', id);
  const refs = allocations.map(({ item }) => doc(firestore, 'inventory', item.id));
  await runTransaction(firestore, async (transaction) => {
    const snapshots = [];
    for (const ref of refs) snapshots.push(await transaction.get(ref));
    for (const [index, allocation] of allocations.entries()) {
      const snapshot = snapshots[index];
      if (!snapshot.exists() || snapshot.data().minimarketId !== data.minimarketId) {
        throw new Error('inventory-changed');
      }
      const current = snapshot.data();
      const taken = Number(allocation.before) - Number(allocation.after);
      const stock = Number(current.stock) - taken;
      if (taken <= 0 || stock < 0) throw new Error('insufficient-stock');
      transaction.update(refs[index], {
        stock, status: stock <= Number(current.minimumStock) ? 'risk' : 'healthy',
      });
    }
    transaction.set(saleRef, sale);
  });
  return sale;
};
