import { FileText, Building } from "lucide-react";
import { UpdateCompanyDTO } from "@/lib/types/company/types";

interface TaxInfoFormProps {
  data: Partial<UpdateCompanyDTO>;
  onChange: (field: keyof UpdateCompanyDTO, value: string) => void;
}

export function TaxInfoForm({ data, onChange }: TaxInfoFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tax ID */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            RUT / CUIT / NIT
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={data.taxId || ""}
              onChange={(e) => onChange("taxId", e.target.value)}
              placeholder="12.345.678-9"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
            />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Número de identificación fiscal
          </p>
        </div>

        {/* Tax Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Razón social
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={data.taxName || ""}
              onChange={(e) => onChange("taxName", e.target.value)}
              placeholder="Empresa SpA"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
            />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Nombre fiscal completo
          </p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-warning-50 rounded-xl p-4">
        <p className="text-sm text-warning-700">
          <strong>⚠️ Importante:</strong> Estos datos son opcionales pero necesarios 
          si quieres que tus recibos tengan validez legal para contabilidad.
        </p>
      </div>
    </div>
  );
}
