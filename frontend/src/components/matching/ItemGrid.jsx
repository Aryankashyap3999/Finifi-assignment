const formatNumber = (value) => (typeof value === 'number' ? value.toFixed(2) : '—');

export const ItemGrid = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
        No items to display yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[960px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">SKU Name</th>
            <th className="px-4 py-3">SKU ID</th>
            <th className="px-4 py-3">Mapped SKU Name</th>
            <th className="px-4 py-3">ERP Code</th>
            <th className="px-4 py-3">EAN</th>
            <th className="px-4 py-3">HSN</th>
            <th className="px-4 py-3">UOM</th>
            <th className="px-4 py-3 text-right">PO Qty</th>
            <th className="px-4 py-3 text-right">GRN Qty</th>
            <th className="px-4 py-3 text-right">Invoice Qty</th>
            <th className="px-4 py-3 text-right">Unit Price</th>
            <th className="px-4 py-3 text-right">Unit MRP</th>
            <th className="px-4 py-3 text-right">Gross Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => {
            const isUnmapped = item.reasons.includes('unmapped_master_sku');
            const isMissingInPo = item.reasons.includes('item_missing_in_po');
            const priceMismatch = item.reasons.includes('price_mismatch');
            const mrpMismatch = item.reasons.includes('mrp_mismatch');
            const grnExceeds = item.reasons.includes('grn_qty_exceeds_po_qty');
            const invoiceExceedsPo = item.reasons.includes('invoice_qty_exceeds_po_qty');
            const invoiceExceedsGrn = item.reasons.includes('invoice_qty_exceeds_grn_qty');
            const unitPrice = item.skuMaster?.agreedRate;
            const unitMrp = item.skuMaster?.mrp;
            const grossAmount = typeof unitPrice === 'number' ? item.poQuantity * unitPrice : null;

            return (
              <tr key={item.key} className={isMissingInPo ? 'bg-red-50/60' : undefined}>
                <td className="px-4 py-3 text-slate-900">{item.description}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.itemCode}</td>
                <td className="px-4 py-3">
                  {isUnmapped ? (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Unmapped
                    </span>
                  ) : (
                    (item.skuMaster?.name ?? '—')
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">{item.skuMaster?.skuErpCode ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{item.skuMaster?.eanCode ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{item.skuMaster?.hsnCode ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500">{item.skuMaster?.uom ?? '—'}</td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${
                    grnExceeds || invoiceExceedsPo ? 'bg-red-50 font-medium text-red-700' : 'text-slate-700'
                  }`}
                >
                  {item.poQuantity}
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${
                    grnExceeds ? 'bg-red-50 font-medium text-red-700' : 'text-slate-700'
                  }`}
                >
                  {item.grnQuantity}
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${
                    invoiceExceedsPo || invoiceExceedsGrn ? 'bg-red-50 font-medium text-red-700' : 'text-slate-700'
                  }`}
                >
                  {item.invoiceQuantity}
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${
                    priceMismatch ? 'bg-red-50 font-medium text-red-700' : 'text-slate-700'
                  }`}
                >
                  {formatNumber(unitPrice)}
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${
                    mrpMismatch ? 'bg-red-50 font-medium text-red-700' : 'text-slate-700'
                  }`}
                >
                  {formatNumber(unitMrp)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {formatNumber(grossAmount)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
