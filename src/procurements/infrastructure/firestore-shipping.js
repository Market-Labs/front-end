import { doc, runTransaction } from 'firebase/firestore';
import { firestore } from '../../shared/infrastructure/firebase-client.js';

export const createShippingOrderInFirestore = async (request, products, supplierId, shippingDate) => {
  const items = request.items.map((item) => ({
    productName: item.productName,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice ?? products.find((product) => product.name === item.productName)?.price ?? 0),
  }));
  if (items.some((item) => item.unitPrice <= 0 || item.quantity <= 0)) throw new Error('invalid-items');
  const id = `ship-${crypto.randomUUID()}`;
  const requestRef = doc(firestore, 'requisitions', request.id);
  const orderRef = doc(firestore, 'purchaseOrders', id);
  const order = {
    id,
    supplyRequestId: request.id,
    supplierId,
    minimarketId: request.minimarketId,
    supplier: request.supplier,
    minimarket: 'Minimarket Verde Sur',
    status: 'pending-reception',
    total: Number(items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toFixed(2)),
    createdAt: new Date().toISOString().slice(0, 10),
    shippingDate,
    observations: 'Orden de envio generada desde una solicitud aceptada.',
    items,
  };

  await runTransaction(firestore, async (transaction) => {
    const requestSnapshot = await transaction.get(requestRef);
    const current = requestSnapshot.data();
    if (!requestSnapshot.exists() || current.status !== 'accepted'
      || current.shippingOrderId || current.supplierId !== supplierId) {
      throw new Error('invalid-request-status');
    }
    transaction.set(orderRef, order);
    transaction.update(requestRef, { shippingOrderId: id });
  });
  return order;
};
