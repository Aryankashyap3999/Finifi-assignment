export const ComingSoonPanel = ({ title, description }) => (
  <div className="flex min-h-[50vh] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white">
    <div className="text-center">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  </div>
);
