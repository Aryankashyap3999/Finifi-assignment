export const PageSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50">
    <span
      className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
      aria-hidden="true"
    />
  </div>
);
