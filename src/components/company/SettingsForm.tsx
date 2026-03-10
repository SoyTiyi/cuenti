import { DollarSign, Globe, Clock } from "lucide-react";
import { UpdateCompanyDTO, CURRENCIES, TIMEZONES } from "@/lib/types/company/types";

interface SettingsFormProps {
  data: Partial<UpdateCompanyDTO>;
  onChange: (field: keyof UpdateCompanyDTO, value: string) => void;
}

export function SettingsForm({ data, onChange }: SettingsFormProps) {
  const selectedCurrency = CURRENCIES.find(c => c.code === data.currency);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Moneda principal
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              value={data.currency || "CLP"}
              onChange={(e) => onChange("currency", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition appearance-none cursor-pointer"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>
          {selectedCurrency && (
            <p className="text-xs text-neutral-400 mt-1">
              Símbolo: {selectedCurrency.symbol}
            </p>
          )}
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Zona horaria
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              value={data.timezone || "America/Santiago"}
              onChange={(e) => onChange("timezone", e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition appearance-none cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-primary-50 rounded-xl p-4">
        <p className="text-sm text-primary-700">
          <strong>💡 Nota:</strong> La moneda se usará en todos tus precios, ventas 
          y recibos. La zona horaria afecta las fechas de tus registros.
        </p>
      </div>
    </div>
  );
}
