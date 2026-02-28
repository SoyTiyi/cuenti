import { useState } from "react";
import { ArrowLeft, UserPlus, Phone, Mail, Loader2 } from "lucide-react";
import type { Client } from "@/lib/types/client/types";

interface NewClientFormProps {
  onBack: () => void;
  onCreated: (client: Client) => void;
  createClient: (data: { name: string; phone: string; email: string }) => Promise<Client>;
}

export function NewClientForm({ onBack, onCreated, createClient }: NewClientFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const client = await createClient({ name, phone, email });
      onCreated(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el cliente.");
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
        <span className="text-sm font-medium text-neutral-700">Nuevo cliente</span>
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <UserPlus size={14} className="text-neutral-400" />
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
          <Phone size={14} className="text-neutral-400" />
        </span>
        <input
          type="tel"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
        />
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Mail size={14} className="text-neutral-400" />
        </span>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
        />
      </div>

      {error && <p className="text-xs text-danger-500">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!name.trim() || isSubmitting}
        className="w-full py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        Agregar cliente
      </button>
    </div>
  );
}
