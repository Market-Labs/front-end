const column = (key, label, kind) => ({ key, label, kind });
const money = (value) => Number(Number(value || 0).toFixed(2));

export const buildReport = (type, sources, isSupplier, t, ownerId = isSupplier ? 'sup-2' : 'min-1') => {
  const products = new Map(sources.products.map((product) => [product.name, product]));
  const suppliers = new Map(sources.suppliers.map((supplier) => [supplier.id, supplier]));
  const orders = sources.orders.filter((order) => isSupplier ? order.supplierId === ownerId : order.minimarketId === ownerId);
  const visibleWaste = sources.waste.filter((record) => record.ownerId === ownerId);
  const title = t(`page.analytics.reportNames.${type}`);
  const c = (key, labelKey, kind) => column(key, t(labelKey), kind);
  let columns = [];
  let rows = [];

  switch (type) {
    case 'Inventario':
      columns = [c('productId', 'common.id'), c('product', 'common.product'), c('category', 'common.category'), c('supplier', 'common.supplier'), c('lot', 'page.inventory.lot'), c('stock', 'common.stock'), c('minimum', 'page.inventory.minimumStock'), c('expiration', 'common.expiration'), c('status', 'common.status')];
      rows = sources.inventory.map((item) => {
        const product = products.get(item.productName);
        return { productId: product?.id || '-', product: item.productName, category: product?.category || '-', supplier: suppliers.get(product?.supplierId)?.businessName || '-', lot: item.lotCode, stock: item.stock, minimum: item.minimumStock, expiration: item.expirationDate, status: t(`status.${item.status}`) };
      });
      break;
    case 'Abastecimiento':
      columns = [c('orderId', 'page.procurements.order'), c('requestId', 'page.requisition.request'), c('supplier', 'common.supplier'), c('minimarket', 'common.minimarket'), c('product', 'common.product'), c('quantity', 'common.quantity'), c('unitPrice', 'common.unitPrice', 'money'), c('subtotal', 'page.analytics.subtotal', 'money'), c('status', 'common.status'), c('date', 'page.procurements.shippingDate')];
      rows = orders.flatMap((order) => order.items.map((item) => ({ orderId: order.id, requestId: order.supplyRequestId || '-', supplier: order.supplier, minimarket: order.minimarket, product: item.productName, quantity: item.quantity, unitPrice: money(item.unitPrice), subtotal: money(item.quantity * item.unitPrice), status: t(`status.${order.status}`), date: order.shippingDate || '-' })));
      break;
    case 'Mermas':
      columns = [c('date', 'common.date'), c('product', 'common.product'), c('lot', 'page.inventory.lot'), c('quantity', 'common.quantity'), c('unit', 'page.analytics.unit'), c('reason', 'page.inventory.wasteReason')];
      rows = visibleWaste.map((record) => ({ date: record.recordedAt, product: record.productName, lot: record.lotCode, quantity: record.quantity, unit: t('page.inventory.units'), reason: t(`page.inventory.wasteReasons.${record.reason}`) }));
      break;
    case 'Conservacion':
      columns = [c('date', 'common.date'), c('zone', 'page.conservation.zone'), c('product', 'common.product'), c('temperature', 'page.conservation.temperature'), c('humidity', 'page.conservation.humidity'), c('status', 'common.status')];
      rows = sources.conservation.map((record) => ({ date: record.recordedAt, zone: record.zone, product: record.productName, temperature: record.temperature, humidity: record.humidity, status: t(`status.${record.status}`) }));
      break;
    case 'Proveedores':
      columns = [c('id', 'common.id'), c('supplier', 'common.supplier'), c('ruc', 'page.analytics.ruc'), c('specialty', 'page.suppliers.specialty'), c('coverage', 'page.suppliers.coverage'), c('orders', 'page.analytics.orders'), c('received', 'page.analytics.received'), c('amount', 'page.analytics.amount', 'money')];
      rows = sources.suppliers.filter((supplier) => supplier.status !== 'inactive' && (!isSupplier || supplier.id === ownerId)).map((supplier) => {
        const related = orders.filter((order) => order.supplierId === supplier.id);
        return { id: supplier.id, supplier: supplier.businessName, ruc: supplier.ruc, specialty: supplier.specialty, coverage: supplier.coverageArea, orders: related.length, received: related.filter((order) => order.status === 'received').length, amount: money(related.filter((order) => order.status === 'received').reduce((sum, order) => sum + Number(order.total), 0)) };
      });
      break;
    default:
      throw new Error('unknown-report');
  }

  return { type, title, columns, rows, generatedAt: new Date().toISOString() };
};
