'use client';

import { useState } from 'react';

import { useDocumentFileUrl } from '@/hooks/useDocumentFileUrl';

const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

export const FilePreview = ({ documentId }) => {
  const [zoom, setZoom] = useState(1);
  const { url, mimeType, isLoading, isError, error } = useDocumentFileUrl(documentId);

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <span
          className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (isError || !url) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-200 bg-white px-4 text-center">
        <p className="text-sm font-medium text-slate-900">Preview unavailable</p>
        <p className="text-sm text-slate-500">{error?.message || 'This file could not be loaded.'}</p>
      </div>
    );
  }

  const isImage = mimeType?.startsWith('image/');

  return (
    <div className="flex min-h-[420px] flex-col rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-end gap-1 border-b border-slate-200 px-3 py-2">
        <button
          type="button"
          onClick={() => setZoom((current) => Math.max(MIN_ZOOM, +(current - ZOOM_STEP).toFixed(2)))}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="w-12 text-center text-xs text-slate-500">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((current) => Math.min(MAX_ZOOM, +(current + ZOOM_STEP).toFixed(2)))}
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          {isImage ? (
            // Blob URL, not a static asset — next/image's optimizer doesn't apply here.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Document preview" className="max-w-none" />
          ) : (
            <iframe src={url} title="Document preview" className="h-[600px] w-[800px] border-0" />
          )}
        </div>
      </div>
    </div>
  );
};
