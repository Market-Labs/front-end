export const nextSupplierId = (suppliers) => {
  const highest = suppliers.reduce((max, supplier) => {
    const match = /^sup-(\d+)$/.exec(String(supplier.id));
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `sup-${highest + 1}`;
};
