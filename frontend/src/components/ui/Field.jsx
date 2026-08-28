export const Field = ({ label, htmlFor, error, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
      {label}
    </label>
    {children}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);
