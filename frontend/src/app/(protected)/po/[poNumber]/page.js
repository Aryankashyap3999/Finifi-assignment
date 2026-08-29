'use client';

import { redirect, useParams } from 'next/navigation';

export default function PoIndexPage() {
  const { poNumber } = useParams();
  redirect(`/po/${poNumber}/purchase-order`);
}
