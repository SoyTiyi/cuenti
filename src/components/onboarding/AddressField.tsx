"use client";

import { MapPin } from "lucide-react";

interface AddressFieldProps {
  value: string;
  onChange: (value: string) => void;
  fieldError?: string;
}

const AddressField = ({ value, onChange, fieldError }: AddressFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Dirección del local
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Calle Principal 123, Ciudad"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
            fieldError ? "border-danger-300" : "border-neutral-200"
          } bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition`}
        />
      </div>
      {fieldError && (
        <p className="text-xs text-danger-500 mt-1">{fieldError}</p>
      )}
    </div>
  );
};

export default AddressField;
