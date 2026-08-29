const formatNumber = (value) => (typeof value === 'number' ? value.toFixed(2) : '—');

export const SkuMasterTable = ({ skuMasters, onEdit, onDelete }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
    <table className="w-full min-w-[820px] text-left text-sm">
      <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
        <tr>
          <th className="px-4 py-3">ERP Code</th>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">EAN</th>
          <th className="px-4 py-3">HSN</th>
          <th className="px-4 py-3">UOM</th>
          <th className="px-4 py-3 text-right">Agreed Rate</th>
          <th className="px-4 py-3 text-right">MRP</th>
          <th className="px-4 py-3 text-right">Tolerance</th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {skuMasters.map((sku) => (
          <tr key={sku._id}>
            <td className="px-4 py-3 font-mono text-xs text-slate-700">{sku.skuErpCode}</td>
            <td className="px-4 py-3 text-slate-900">{sku.name}</td>
            <td className="px-4 py-3 text-slate-500">{sku.eanCode ?? '—'}</td>
            <td className="px-4 py-3 text-slate-500">{sku.hsnCode ?? '—'}</td>
            <td className="px-4 py-3 text-slate-500">{sku.uom ?? '—'}</td>
            <td className="px-4 py-3 text-right tabular-nums text-slate-700">{formatNumber(sku.agreedRate)}</td>
            <td className="px-4 py-3 text-right tabular-nums text-slate-700">{formatNumber(sku.mrp)}</td>
            <td className="px-4 py-3 text-right tabular-nums text-slate-700">
              {typeof sku.priceTolerance === 'number' ? `${(sku.priceTolerance * 100).toFixed(0)}%` : '—'}
            </td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(sku)}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(sku)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
