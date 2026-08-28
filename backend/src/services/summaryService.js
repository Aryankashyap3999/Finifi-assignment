import { computeMatchResult } from './matchEngine.js';

const sumQuantity = (items, quantityField) =>
  items.reduce((total, item) => total + item[quantityField], 0);

export const getSummaryService = async (poNumber) => {
  const { status, linkedDocuments, items } = await computeMatchResult(poNumber);

  const poAmount = items.reduce(
    (total, item) => total + item.poQuantity * (item.skuMaster?.agreedRate || 0),
    0
  );
  const totalReceived = items.reduce(
    (total, item) => total + item.grnQuantity * (item.skuMaster?.agreedRate || 0),
    0
  );
  const totalInvoiced = linkedDocuments.invoices.reduce(
    (total, invoice) =>
      total + invoice.items.reduce((lineTotal, item) => lineTotal + item.quantity * (item.unitRate || 0), 0),
    0
  );

  const totalPoQuantity = items.reduce((total, item) => total + item.poQuantity, 0);

  const events = [
    ...linkedDocuments.grns.map((grn) => ({
      documentType: 'grn',
      documentNumber: grn.grnNumber,
      date: grn.grnDate,
      receivedQuantity: sumQuantity(grn.items, 'receivedQuantity'),
      invoicedQuantity: 0
    })),
    ...linkedDocuments.invoices.map((invoice) => ({
      documentType: 'invoice',
      documentNumber: invoice.invoiceNumber,
      date: invoice.invoiceDate,
      receivedQuantity: 0,
      invoicedQuantity: sumQuantity(invoice.items, 'quantity')
    }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  let cumulativeReceivedQuantity = 0;
  let cumulativeInvoicedQuantity = 0;
  const rows = events.map((event) => {
    cumulativeReceivedQuantity += event.receivedQuantity;
    cumulativeInvoicedQuantity += event.invoicedQuantity;
    return {
      ...event,
      cumulativeReceivedQuantity,
      cumulativeInvoicedQuantity,
      pendingDelivery: totalPoQuantity - cumulativeReceivedQuantity
    };
  });

  rows.push({
    documentType: 'status',
    documentNumber: null,
    date: null,
    receivedQuantity: null,
    invoicedQuantity: null,
    cumulativeReceivedQuantity,
    cumulativeInvoicedQuantity,
    pendingDelivery: totalPoQuantity - cumulativeReceivedQuantity,
    status
  });

  return {
    poNumber,
    stats: { poAmount, totalInvoiced, totalReceived },
    rows
  };
};
