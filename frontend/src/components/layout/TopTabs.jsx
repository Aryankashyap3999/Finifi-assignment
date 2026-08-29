'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { key: 'purchase-order', label: 'Purchase Order' },
  { key: 'fulfillment', label: 'Fulfillment' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'summary', label: 'Summary' }
];

export const TopTabs = ({ poNumber, counts }) => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-slate-200 bg-white px-6">
      {TABS.map((tab) => {
        const href = `/po/${poNumber}/${tab.key}`;
        const isActive = pathname === href;
        const count = counts[tab.key];

        return (
          <Link
            key={tab.key}
            href={href}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {typeof count === 'number' && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
