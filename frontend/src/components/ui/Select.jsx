export const Select = ({ className = '', children, ...props }) => (
  <select
    className={`w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-shadow duration-150 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 ${className}`}
    {...props}
  >
    {children}
  </select>
);
