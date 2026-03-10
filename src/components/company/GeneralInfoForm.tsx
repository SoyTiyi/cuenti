import { Building2, MapPin, FileText } from "lucide-react";
import { LogoUploader } from "./LogoUploader";
import { Company, UpdateCompanyDTO } from "@/lib/types/company/types";

interface GeneralInfoFormProps {
  data: Partial<UpdateCompanyDTO>;
  onChange: (field: keyof UpdateCompanyDTO, value: string) => void;
  onLogoUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
  company?: Company | null;
}

export function GeneralInfoForm({
  data,
  onChange,
  onLogoUpload,
  isUploading,
  company,
}: GeneralInfoFormProps) {
  return (
    <div className="space-y-6">
      {/* Logo and Name Row */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <LogoUploader
          currentLogo={data.companyImage || null}
          companyName={data.name || "N"}
          onUpload={onLogoUpload}
          isUploading={isUploading}
        />

        <div className="flex-1 w-full space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Nombre del negocio <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={data.name || ""}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Ej: Irenita Nails Studio"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Dirección <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={data.address || ""}
                onChange={(e) => onChange("address", e.target.value)}
                placeholder="Ej: Av. Principal 123, Santiago"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Descripción del negocio
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
          <textarea
            value={data.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Describe tu negocio..."
            rows={3}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition resize-none"
          />
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Esta descripción aparecerá en tus recibos
        </p>
      </div>
    </div>
  );
}
