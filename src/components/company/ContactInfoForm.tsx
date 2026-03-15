import { Phone, Mail, Globe } from "lucide-react";
import { UpdateCompanyDTO } from "@/lib/types/company/types";

interface ContactInfoFormProps {
  data: Partial<UpdateCompanyDTO>;
  onChange: (field: keyof UpdateCompanyDTO, value: string) => void;
}

export function ContactInfoForm({ data, onChange }: ContactInfoFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Teléfono del negocio
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="tel"
              value={data.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+56 9 1234 5678"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Email de contacto
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              value={data.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="contacto@tuempresa.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
            />
          </div>
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Sitio web o redes sociales
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="url"
            value={data.website || ""}
            onChange={(e) => onChange("website", e.target.value)}
            placeholder="https://instagram.com/tuempresa"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
          />
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Puedes poner tu Instagram, Facebook o página web
        </p>
      </div>

      {/* Info box */}
      <div className="bg-primary-50 rounded-xl p-4">
        <p className="text-sm text-primary-700">
          <strong>💡 Tip:</strong> Estos datos aparecerán en tus recibos para que 
          tus clientes puedan contactarte fácilmente.
        </p>
      </div>
    </div>
  );
}
