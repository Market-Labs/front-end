import { collection, doc, getDocs, query, runTransaction, where } from 'firebase/firestore';
import { firestore } from '../../shared/infrastructure/firebase-client.js';

export const receiveOrderInFirestore = async (order, products, administratorId) => {
  const inventorySnapshot = await getDocs(query(
    collection(firestore, 'inventory'), where('minimarketId', '==', order.minimarketId),
  ));
  const inventory = inventorySnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  const orderRef = doc(firestore, 'purchaseOrders', order.id);
  const receivedAt = new Date().toISOString();
  const planned = order.items.map((item, index) => {
    const existing = inventory.find((entry) => entry.productName === item.productName);
    const product = products.find((entry) => entry.name === item.productName);
    if (!existing && !product) throw new Error(`missing-product:${item.productName}`);
    return {
      item,
      existing,
      product,
      ref: doc(firestore, 'inventory', existing?.id || `inv-${order.id}-${index}`),
    };
  });

  return runTransaction(firestore, async (transaction) => {
    const orderSnapshot = await transaction.get(orderRef);
    if (!orderSnapshot.exists() || orderSnapshot.data().status !== 'pending-reception') {
      throw new Error('invalid-order-status');
    }
    const currentItems = [];
    for (const entry of planned) currentItems.push(await transaction.get(entry.ref));

    planned.forEach((entry, index) => {
      const snapshot = currentItems[index];
      if (entry.existing) {
        if (!snapshot.exists()) throw new Error('inventory-changed');
        const current = snapshot.data();
        const stock = Number(current.stock) + Number(entry.item.quantity);
        transaction.update(entry.ref, {
          stock,
          status: stock <= Number(current.minimumStock) ? 'risk' : 'healthy',
        });
      } else {
        if (snapshot.exists()) throw new Error('inventory-changed');
        transaction.set(entry.ref, {
          id: entry.ref.id,
          minimarketId: order.minimarketId,
          productName: entry.item.productName,
          stock: Number(entry.item.quantity),
          minimumStock: 0,
          lotCode: `SHIP-${order.id}`,
          expirationDate: entry.product.expirationDate,
          status: 'healthy',
        });
      }
    });

    const changes = {
      status: 'received',
      receivedAt,
      reception: { administratorId, accepted: true, reviewedAt: receivedAt },
    };
    transaction.update(orderRef, changes);
    return { ...orderSnapshot.data(), ...changes, id: order.id };
  });
};
