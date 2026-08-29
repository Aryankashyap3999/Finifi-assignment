'use client';

import { useParams } from 'next/navigation';

import { DetailFormSection } from '@/components/matching/DetailFormSection';
import { FilePreview } from '@/components/matching/FilePreview';
import { ItemGrid } from '@/components/matching/ItemGrid';
import { MismatchBanner } from '@/components/matching/MismatchBanner';
import { useMatch } from '@/hooks/useMatch';

export default function PurchaseOrderTabPage() {
  const { poNumber } = useParams();
  const matchQuery = useMatch(poNumber);

  // The (protected)/po/[poNumber]/layout.js above this page already renders
  // the loading spinner / error state for this same query, so by the time
  // this page paints, matchQuery.data is guaranteed to be present.
  if (!matchQuery.data) return null;

  const { status, reasons, linkedDocuments, items } = matchQuery.data;
  const po = linkedDocuments.pos[0];

  if (!po) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-slate-900">No Purchase Order uploaded yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Upload a PO for {poNumber} to see its details here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <MismatchBanner status={status} reasons={reasons} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DetailFormSection
          title="Purchase Order Details"
          fields={[
            { label: 'PO Number', value: po.poNumber },
            { label: 'Vendor', value: po.vendorName },
            { label: 'PO Date', value: new Date(po.poDate).toLocaleDateString() },
            { label: 'Uploaded', value: new Date(po.createdAt).toLocaleString() }
          ]}
        />
        <FilePreview documentId={po._id} />
      </div>

      <div className="mt-6">
        <ItemGrid items={items} />
      </div>
    </div>
  );
}
