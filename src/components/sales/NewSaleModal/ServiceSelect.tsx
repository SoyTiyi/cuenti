import { useState } from "react";
import { Package, Plus, Loader2 } from "lucide-react";
import { SelectDropdown } from "@/components/ui";
import { NewServiceForm } from "@/components/services/NewServiceForm";
import { formatCurrency } from "@/lib/utils/formatters";
import type { Service } from "@/lib/types/service/types";

interface ServiceSelectProps {
  services: Service[];
  selectedId: number | null;
  isLoading: boolean;
  onSelect: (service: Service) => void;
  createService: (data: { name: string; description: string; price: number }) => Promise<Service>;
}

export function ServiceSelect({ services, selectedId, isLoading, onSelect, createService }: ServiceSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"list" | "new">("list");

  const selected = services.find((s) => s.id === selectedId);

  return (
    <SelectDropdown
      label="Servicio"
      required
      displayValue={selected ? selected.name : "Selecciona un servicio"}
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
      icon={<Package size={16} />}
    >
      {view === "new" ? (
        <NewServiceForm
          onBack={() => setView("list")}
          createService={createService}
          onCreated={(service) => {
            onSelect(service);
            setView("list");
            setIsOpen(false);
          }}
        />
      ) : (
        <>
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-neutral-400" />
              </div>
            ) : services.length === 0 ? (
              <p className="px-4 py-3 text-sm text-neutral-400">No hay servicios aún</p>
            ) : (
              services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => { onSelect(service); setIsOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors cursor-pointer flex justify-between items-center gap-2 ${
                    selectedId === service.id ? "bg-primary-50 text-primary-700" : "text-neutral-700"
                  }`}
                >
                  <span className="font-medium truncate">{service.name}</span>
                  <span className="text-neutral-500 flex-shrink-0">{formatCurrency(Number(service.price))}</span>
                </button>
              ))
            )}
          </div>
          <div className="border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setView("new")}
              className="w-full px-4 py-2.5 text-left text-sm text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-2 font-medium"
            >
              <Plus size={16} />
              Crear nuevo servicio
            </button>
          </div>
        </>
      )}
    </SelectDropdown>
  );
}
