"use client";

interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  maxLength: number;
  fieldError?: string;
}

const DescriptionField = ({
  value,
  onChange,
  length,
  maxLength,
  fieldError,
}: DescriptionFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Descripción breve
      </label>
      <textarea
        placeholder="¿Qué hace especial a tu negocio?"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={`w-full px-4 py-2.5 rounded-xl border ${
          fieldError ? "border-danger-300" : "border-neutral-200"
        } bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition resize-none`}
      />
      <p className="text-xs text-neutral-400 text-right mt-1">
        {length}/{maxLength} caracteres
      </p>
      {fieldError && (
        <p className="text-xs text-danger-500 mt-1">{fieldError}</p>
      )}
    </div>
  );
};

export default DescriptionField;
