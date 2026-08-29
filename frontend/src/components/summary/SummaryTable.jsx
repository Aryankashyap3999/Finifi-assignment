import { Badge } from '@/components/ui/Badge';
import { MATCH_STATUS_LABELS, MATCH_STATUS_VARIANTS } from '@/lib/matchStatus';

export const SummaryTable = ({ rows }) => {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
        No GRNs or invoices uploaded yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Document</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Received Qty</th>
            <th className="px-4 py-3 text-right">Invoiced Qty</th>
            <th className="px-4 py-3 text-right">Cumulative Received</th>
            <th className="px-4 py-3 text-right">Cumulative Invoiced</th>
            <th className="px-4 py-3 text-right">Pending Delivery</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, index) => {
            const isStatusRow = row.documentType === 'status';
            return (
              <tr
                key={isStatusRow ? 'status' : `${row.documentType}-${row.documentNumber}-${index}`}
                className={isStatusRow ? 'bg-slate-50 font-medium' : undefined}
              >
                <td className="px-4 py-3 text-slate-900">
                  {isStatusRow ? (
                    <span className="flex items-center gap-2">
                      Current Status
                      <Badge variant={MATCH_STATUS_VARIANTS[row.status]}>
                        {MATCH_STATUS_LABELS[row.status]}
                      </Badge>
                    </span>
                  ) : (
                    <>
                      <span className="text-xs uppercase text-slate-400">{row.documentType}</span>{' '}
                      {row.documentNumber}
                    </>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {row.date ? new Date(row.date).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {row.receivedQuantity ?? '—'}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {row.invoicedQuantity ?? '—'}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {row.cumulativeReceivedQuantity}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {row.cumulativeInvoicedQuantity}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">{row.pendingDelivery}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
