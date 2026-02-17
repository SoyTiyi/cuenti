"use client";

import { Camera } from "lucide-react";

interface LogoUploaderProps {
  logo: File | null;
  onLogoChange: (file: File | null) => void;
  fieldError?: string;
}

const LogoUploader = ({ logo, onLogoChange, fieldError }: LogoUploaderProps) => {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
        <Camera className="w-6 h-6 text-primary-500" />
      </div>
      <div>
        <p className="font-semibold text-neutral-800 text-sm">
          Logotipo del negocio
        </p>
        <p className="text-neutral-400 text-xs mt-0.5">
          Sube tu logo para personalizar tus facturas y reportes
          (Opcional).
          <br />
          Formatos: JPG, PNG. Máx 2MB.
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => onLogoChange(e.target.files?.[0] || null)}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="text-primary-500 font-semibold text-sm mt-1.5 hover:text-primary-600 cursor-pointer inline-block"
        >
          {logo ? logo.name : "Subir imagen"}
        </label>
        {fieldError && (
          <p className="text-xs text-danger-500 mt-1">{fieldError}</p>
        )}
      </div>
    </div>
  );
};

export default LogoUploader;
