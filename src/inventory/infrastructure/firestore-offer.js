import { doc, runTransaction } from 'firebase/firestore';
import { firestore } from '../../shared/infrastructure/firebase-client.js';

export const registerOfferInFirestore = ({ itemId, ownerId, quantity, offerPrice, endDate }) => {
  const ref = doc(firestore, 'inventory', itemId);
  return runTransaction(firestore, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists() || snapshot.data().minimarketId !== ownerId) throw new Error('inventory-changed');
    const current = snapshot.data();
    const today = new Date().toISOString().slice(0, 10);
    const offers = current.offers || [];
    const reserved = offers.filter((offer) => offer.status === 'active' && offer.endDate >= today)
      .reduce((total, offer) => total + Number(offer.quantity), 0);
    if (quantity > Number(current.stock) - reserved || endDate < today || endDate > current.expirationDate) throw new Error('invalid-offer');
    const offer = {
      id: `offer-${crypto.randomUUID()}`, inventoryItemId: itemId, lotCode: current.lotCode,
      quantity, offerPrice, startDate: today, endDate, status: 'active',
    };
    transaction.update(ref, { offers: [...offers, offer] });
    return { ...current, offers: [...offers, offer] };
  });
};
