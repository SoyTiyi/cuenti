import { useState } from "react";
import { ArrowLeft, Package, FileText, DollarSign, Loader2 } from "lucide-react";
import type { Service } from "@/lib/types/service/types";

interface NewServiceFormProps {
  onBack: () => void;
  onCreated: (service: Service) => void;
  createService: (data: { name: string; description: string; price: number }) => Promise<Service>;
}

export function NewServiceForm({ onBack, onCreated, createService }: NewServiceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && price.length > 0 && parseFloat(price) > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const service = await createService({ name, description, price: parseFloat(price) });
      onCreated(service);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el servicio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 space-y-2.5">
      <div className="flex items-center gap-2 mb-1">
        <button
          type="button"
          onClick={onBack}
          className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-medium text-neutral-700">Nuevo servicio</span>
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Package size={14} className="text-neutral-400" />
        </span>
        <input
          type="text"
          placeholder="Nombre *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
        />
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <FileText size={14} className="text-neutral-400" />
        </span>
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
        />
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <DollarSign size={14} className="text-neutral-400" />
        </span>
        <input
          type="number"
          placeholder="Precio *"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
        />
      </div>

      {error && <p className="text-xs text-danger-500">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        className="w-full py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        Agregar servicio
      </button>
    </div>
  );
}
