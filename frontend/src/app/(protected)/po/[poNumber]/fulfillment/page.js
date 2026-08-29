'use client';

import { useParams } from 'next/navigation';

import { DocumentDetailTab } from '@/components/matching/DocumentDetailTab';
import { useMatch } from '@/hooks/useMatch';

export default function FulfillmentTabPage() {
  const { poNumber } = useParams();
  const matchQuery = useMatch(poNumber);

  if (!matchQuery.data) return null;

  return (
    <DocumentDetailTab
      matchResult={matchQuery.data}
      documents={matchQuery.data.linkedDocuments.invoices}
      numberField="invoiceNumber"
      dateField="invoiceDate"
      label="Invoice"
      accentColor="bg-indigo-500"
      quantityField="quantity"
      quantityLabel="Invoice Qty"
      showUnitPrice
      emptyTitle="No invoices uploaded yet"
      emptyDescription={`Upload an invoice for ${poNumber} to see its details here.`}
    />
  );
}
