'use client';

export const DocumentSubTabs = ({ documents, selectedId, onSelect, numberField, label }) => {
  if (documents.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {documents.map((document) => {
        const isActive = document._id === selectedId;
        return (
          <button
            key={document._id}
            type="button"
            onClick={() => onSelect(document._id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {label}: {document[numberField]}
          </button>
        );
      })}
    </div>
  );
};
