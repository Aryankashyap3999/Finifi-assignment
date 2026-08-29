'use client';

import { useMemo, useState } from 'react';

import { SkuMasterFormModal } from '@/components/skuMaster/SkuMasterFormModal';
import { SkuMasterTable } from '@/components/skuMaster/SkuMasterTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { useDeleteSkuMaster } from '@/hooks/useDeleteSkuMaster';
import { useSkuMasters } from '@/hooks/useSkuMasters';

export default function SkuMasterPage() {
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState({ isOpen: false, skuMaster: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const skuMastersQuery = useSkuMasters();
  const deleteMutation = useDeleteSkuMaster();

  const skuMasters = skuMastersQuery.data ?? [];
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return skuMasters;
    return skuMasters.filter(
      (sku) =>
        sku.skuErpCode.toLowerCase().includes(term) ||
        sku.name.toLowerCase().includes(term) ||
        sku.eanCode?.toLowerCase().includes(term)
    );
  }, [skuMasters, search]);

  const handleDelete = () => {
    deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">SKU Master</h1>
          <p className="mt-1 text-sm text-slate-500">
            The catalogue every uploaded document&apos;s line items get resolved against.
          </p>
        </div>
        <Button onClick={() => setFormModal({ isOpen: true, skuMaster: null })}>New SKU</Button>
      </div>

      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by ERP code, name, or EAN..."
        className="mb-6 max-w-sm"
      />

      {skuMastersQuery.isLoading && <ListSkeleton />}

      {skuMastersQuery.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {skuMastersQuery.error.message}
        </div>
      )}

      {skuMastersQuery.isSuccess && skuMasters.length === 0 && (
        <EmptyState onCreate={() => setFormModal({ isOpen: true, skuMaster: null })} />
      )}

      {skuMastersQuery.isSuccess && skuMasters.length > 0 && filtered.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
          No SKUs match &quot;{search}&quot;.
        </p>
      )}

      {filtered.length > 0 && (
        <SkuMasterTable
          skuMasters={filtered}
          onEdit={(sku) => setFormModal({ isOpen: true, skuMaster: sku })}
          onDelete={setDeleteTarget}
        />
      )}

      <SkuMasterFormModal
        isOpen={formModal.isOpen}
        skuMaster={formModal.skuMaster}
        onClose={() => setFormModal({ isOpen: false, skuMaster: null })}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete SKU Master"
        description={
          deleteTarget
            ? `Delete "${deleteTarget.name}" (${deleteTarget.skuErpCode})? This cannot be undone.`
            : ''
        }
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((key) => (
        <div key={key} className="h-14 animate-pulse rounded-xl bg-slate-100" />
      ))}
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-6 py-16 text-center">
      <p className="text-sm font-medium text-slate-900">No SKU masters yet</p>
      <p className="mt-1 text-sm text-slate-500">Create one to start resolving document line items.</p>
      <Button variant="secondary" className="mt-4" onClick={onCreate}>
        New SKU
      </Button>
    </div>
  );
}
