'use client';

import { useParams } from 'next/navigation';

import { StatCard } from '@/components/summary/StatCard';
import { SummaryTable } from '@/components/summary/SummaryTable';
import { useSummary } from '@/hooks/useSummary';
import { formatCurrency } from '@/lib/formatCurrency';

export default function SummaryTabPage() {
  const { poNumber } = useParams();
  const summaryQuery = useSummary(poNumber);

  if (summaryQuery.isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <span
          className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (summaryQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {summaryQuery.error.message}
      </div>
    );
  }

  const { stats, rows } = summaryQuery.data;

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="PO Amount" value={formatCurrency(stats.poAmount)} />
        <StatCard label="Total Invoiced" value={formatCurrency(stats.totalInvoiced)} />
        <StatCard label="Total Received" value={formatCurrency(stats.totalReceived)} />
      </div>

      <h2 className="mb-3 text-sm font-semibold text-slate-900">Associated Invoice &amp; GRN</h2>
      <SummaryTable rows={rows} />
    </div>
  );
}
