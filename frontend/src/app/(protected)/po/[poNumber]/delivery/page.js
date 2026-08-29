'use client';

import { useParams } from 'next/navigation';

import { DocumentDetailTab } from '@/components/matching/DocumentDetailTab';
import { useMatch } from '@/hooks/useMatch';

export default function DeliveryTabPage() {
  const { poNumber } = useParams();
  const matchQuery = useMatch(poNumber);

  if (!matchQuery.data) return null;

  return (
    <DocumentDetailTab
      matchResult={matchQuery.data}
      documents={matchQuery.data.linkedDocuments.grns}
      numberField="grnNumber"
      dateField="grnDate"
      label="GRN"
      accentColor="bg-emerald-500"
      quantityField="receivedQuantity"
      quantityLabel="Received Qty"
      showUnitPrice={false}
      emptyTitle="No GRNs uploaded yet"
      emptyDescription={`Upload a GRN for ${poNumber} to see its details here.`}
    />
  );
}
