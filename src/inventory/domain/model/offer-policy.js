export const reconcileOffers = (offers = [], stock, today = new Date().toISOString().slice(0, 10)) => {
  const result = offers.map((offer) => ({ ...offer }));
  let reserved = result.filter((offer) => offer.status === 'active' && offer.endDate >= today)
    .reduce((total, offer) => total + Number(offer.quantity), 0);
  for (let index = result.length - 1; index >= 0 && reserved > stock; index -= 1) {
    const offer = result[index];
    if (offer.status !== 'active' || offer.endDate < today) continue;
    const reduction = Math.min(Number(offer.quantity), reserved - stock);
    offer.quantity -= reduction;
    reserved -= reduction;
    if (offer.quantity === 0) offer.status = 'exhausted';
  }
  return result;
};
