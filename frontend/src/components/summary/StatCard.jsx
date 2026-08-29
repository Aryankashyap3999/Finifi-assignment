export const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <p className="text-xs font-medium text-slate-400">{label}</p>
    <p className="mt-1.5 text-2xl font-semibold text-slate-900">{value}</p>
  </div>
);
