'use client';

import { useParams } from 'next/navigation';

import { TopTabs } from '@/components/layout/TopTabs';
import { PageSpinner } from '@/components/ui/PageSpinner';
import { useMatch } from '@/hooks/useMatch';

export default function PoLayout({ children }) {
  const { poNumber } = useParams();
  const matchQuery = useMatch(poNumber);

  if (matchQuery.isLoading) {
    return <PageSpinner />;
  }

  if (matchQuery.isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 text-center">
        <div>
          <p className="text-sm font-medium text-red-600">Failed to load this purchase order</p>
          <p className="mt-1 text-sm text-slate-500">{matchQuery.error.message}</p>
        </div>
      </div>
    );
  }

  const counts = {
    'purchase-order': matchQuery.data.linkedDocuments.pos.length,
    fulfillment: matchQuery.data.linkedDocuments.invoices.length,
    delivery: matchQuery.data.linkedDocuments.grns.length
  };

  return (
    <div>
      <TopTabs poNumber={poNumber} counts={counts} />
      <main className="p-6">{children}</main>
    </div>
  );
}
