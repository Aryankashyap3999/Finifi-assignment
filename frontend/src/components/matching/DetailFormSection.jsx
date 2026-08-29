export const DetailFormSection = ({ title, accentColor = 'bg-slate-900', fields }) => (
  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 pl-6">
    <span className={`absolute inset-y-0 left-0 w-1 ${accentColor}`} aria-hidden="true" />
    <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
      {fields.map(({ label, value }) => (
        <div key={label}>
          <dt className="text-xs font-medium text-slate-400">{label}</dt>
          <dd className="mt-0.5 text-sm text-slate-900">{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  </div>
);
