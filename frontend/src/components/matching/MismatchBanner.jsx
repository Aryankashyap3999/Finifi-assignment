import { Badge } from '@/components/ui/Badge';
import { MATCH_STATUS_LABELS, MATCH_STATUS_VARIANTS, REASON_LABELS } from '@/lib/matchStatus';

export const MismatchBanner = ({ status, reasons }) => {
  if (status === 'matched' || reasons.length === 0) return null;

  const isHardViolation = status === 'mismatch';

  return (
    <div
      className={`mb-6 rounded-xl border px-4 py-3 ${
        isHardViolation ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
      }`}
    >
      <Badge variant={MATCH_STATUS_VARIANTS[status]}>{MATCH_STATUS_LABELS[status]}</Badge>
      <ul className="mt-2 flex flex-wrap gap-2">
        {reasons.map((reason) => (
          <li
            key={reason}
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              isHardViolation ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {REASON_LABELS[reason] ?? reason}
          </li>
        ))}
      </ul>
    </div>
  );
};
