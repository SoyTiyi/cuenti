interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 w-full cursor-pointer"
    >
      <div
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-success-500" : "bg-neutral-200"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
    </button>
  );
}
