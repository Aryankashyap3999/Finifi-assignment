const formatNumber = (value) => (typeof value === 'number' ? value.toFixed(2) : '—');

// Scoped to a single GRN/Invoice's own line items (unlike ItemGrid, which
// shows the PO-wide aggregate). showUnitPrice is false for GRN rows since
// the Grn schema has no unitRate field — only mrp.
export const DocumentItemGrid = ({ items, quantityLabel, showUnitPrice = false }) => {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
        No items to display yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] text-left text-sm">
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
            <th className="px-4 py-3 text-right">{quantityLabel}</th>
            {showUnitPrice && <th className="px-4 py-3 text-right">Unit Price</th>}
            <th className="px-4 py-3 text-right">Unit MRP</th>
            {showUnitPrice && <th className="px-4 py-3 text-right">Gross Amount</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => {
            const isUnmapped = item.reasons.includes('unmapped_master_sku');
            const priceMismatch = item.reasons.includes('price_mismatch');
            const mrpMismatch = item.reasons.includes('mrp_mismatch');
            const grossAmount =
              showUnitPrice && typeof item.unitRate === 'number' ? item.quantity * item.unitRate : null;

            return (
              <tr key={item.key}>
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
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">{item.poQuantity}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">{item.quantity}</td>
                {showUnitPrice && (
                  <td
                    className={`px-4 py-3 text-right tabular-nums ${
                      priceMismatch ? 'bg-red-50 font-medium text-red-700' : 'text-slate-700'
                    }`}
                  >
                    {formatNumber(item.unitRate)}
                  </td>
                )}
                <td
                  className={`px-4 py-3 text-right tabular-nums ${
                    mrpMismatch ? 'bg-red-50 font-medium text-red-700' : 'text-slate-700'
                  }`}
                >
                  {formatNumber(item.mrp)}
                </td>
                {showUnitPrice && (
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                    {formatNumber(grossAmount)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
