interface StatusBadgeProps {
  isPaid: boolean;
}

export function StatusBadge({ isPaid }: StatusBadgeProps) {
  return isPaid ? (
    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
      Pagada
    </span>
  ) : (
    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
      Pendiente
    </span>
  );
}
