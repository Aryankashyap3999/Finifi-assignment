'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuth } from '@/providers/AuthProvider';

export const IconRail = () => {
  const { logout } = useAuth();
  const pathname = usePathname();
  const isSkuMasterActive = pathname.startsWith('/sku-master');

  return (
    <aside className="flex w-16 shrink-0 flex-col items-center justify-between border-r border-slate-200 bg-white py-4">
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white transition-transform hover:scale-105"
          title="Purchase Orders"
        >
          3W
        </Link>
        <Link
          href="/sku-master"
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
            isSkuMasterActive
              ? 'bg-slate-100 text-slate-900'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
          title="SKU Master"
          aria-label="SKU Master"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.11-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" />
            <polyline points="2.32 6.16 12 11 21.68 6.16" />
            <line x1="12" y1="22.76" x2="12" y2="11" />
          </svg>
        </Link>
      </div>
      <button
        type="button"
        onClick={logout}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Log out"
        title="Log out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </aside>
  );
};
