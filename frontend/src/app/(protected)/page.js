'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { UploadDocumentModal } from '@/components/documents/UploadDocumentModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDocuments } from '@/hooks/useDocuments';

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const documentsQuery = useDocuments({ type: 'po' });

  const pos = documentsQuery.data ?? [];
  const filteredPos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return pos;
    return pos.filter(
      ({ document }) =>
        document.poNumber.toLowerCase().includes(term) ||
        document.vendorName?.toLowerCase().includes(term)
    );
  }, [pos, search]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Purchase Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, review, and reconcile every PO you&apos;ve uploaded.
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)}>Upload document</Button>
      </div>

      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by PO number or vendor..."
        className="mb-6 max-w-sm"
      />

      {documentsQuery.isLoading && <ListSkeleton />}

      {documentsQuery.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {documentsQuery.error.message}
        </div>
      )}

      {documentsQuery.isSuccess && pos.length === 0 && (
        <EmptyState onUpload={() => setIsUploadOpen(true)} />
      )}

      {documentsQuery.isSuccess && pos.length > 0 && filteredPos.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          No purchase orders match &quot;{search}&quot;.
        </p>
      )}

      {filteredPos.length > 0 && (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {filteredPos.map(({ document }) => (
            <li key={document._id}>
              <Link
                href={`/po/${document.poNumber}/purchase-order`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{document.poNumber}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{document.vendorName}</p>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <p>{new Date(document.poDate).toLocaleDateString()}</p>
                  <p className="mt-0.5">{document.items.length} items</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <UploadDocumentModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((key) => (
        <div key={key} className="h-16 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

function EmptyState({ onUpload }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-6 py-16 text-center">
      <p className="text-sm font-medium text-slate-900">No purchase orders yet</p>
      <p className="mt-1 text-sm text-slate-500">Upload a PO to get started with matching.</p>
      <Button variant="secondary" className="mt-4" onClick={onUpload}>
        Upload document
      </Button>
    </div>
  );
}
