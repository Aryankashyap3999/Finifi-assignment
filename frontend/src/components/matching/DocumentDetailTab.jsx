'use client';

import { useEffect, useState } from 'react';

import { DetailFormSection } from '@/components/matching/DetailFormSection';
import { DocumentItemGrid } from '@/components/matching/DocumentItemGrid';
import { DocumentSubTabs } from '@/components/matching/DocumentSubTabs';
import { FilePreview } from '@/components/matching/FilePreview';
import { MismatchBanner } from '@/components/matching/MismatchBanner';
import { useDocument } from '@/hooks/useDocument';
import { buildMatchItemLookup, keyForDocumentItem } from '@/lib/matchItems';

// Shared by the Fulfillment (Invoice) and Delivery (GRN) tabs, which are
// structurally identical — sub-tab pills, form panel + preview for whichever
// document is selected, item grid scoped to that document — and differ only
// in field names and whether a unit price exists on that document type.
export const DocumentDetailTab = ({
  matchResult,
  documents,
  numberField,
  dateField,
  label,
  accentColor,
  quantityField,
  quantityLabel,
  showUnitPrice,
  emptyTitle,
  emptyDescription
}) => {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!selectedId && documents.length > 0) {
      setSelectedId(documents[0]._id);
    }
  }, [documents, selectedId]);

  const documentQuery = useDocument(selectedId);

  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-slate-900">{emptyTitle}</p>
        <p className="mt-1 text-sm text-slate-500">{emptyDescription}</p>
      </div>
    );
  }

  const document = documentQuery.data?.document;
  const matchItemsByKey = buildMatchItemLookup(matchResult.items);

  const rows =
    document?.items.map((item) => {
      const key = keyForDocumentItem(item);
      const matchItem = matchItemsByKey.get(key);
      return {
        key: item._id,
        itemCode: item.itemCode,
        description: item.description,
        skuMaster: matchItem?.skuMaster ?? item.skuMaster ?? null,
        reasons: matchItem?.reasons ?? [],
        poQuantity: matchItem?.poQuantity ?? 0,
        quantity: item[quantityField],
        unitRate: item.unitRate ?? null,
        mrp: item.mrp ?? null
      };
    }) ?? [];

  return (
    <div>
      <DocumentSubTabs
        documents={documents}
        selectedId={selectedId}
        onSelect={setSelectedId}
        numberField={numberField}
        label={label}
      />

      {document && (
        <>
          <MismatchBanner status={matchResult.status} reasons={matchResult.reasons} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DetailFormSection
              title={`${label} Details`}
              accentColor={accentColor}
              fields={[
                { label: `${label} Number`, value: document[numberField] },
                { label: 'PO Number', value: document.poNumber },
                { label: `${label} Date`, value: new Date(document[dateField]).toLocaleDateString() },
                { label: 'Uploaded', value: new Date(document.createdAt).toLocaleString() }
              ]}
            />
            <FilePreview documentId={document._id} />
          </div>

          <div className="mt-6">
            <DocumentItemGrid items={rows} quantityLabel={quantityLabel} showUnitPrice={showUnitPrice} />
          </div>
        </>
      )}
    </div>
  );
};
