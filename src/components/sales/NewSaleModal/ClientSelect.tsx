import { useState } from "react";
import { UserPlus, Plus, Loader2 } from "lucide-react";
import { SelectDropdown, ClientAvatar } from "@/components/ui";
import { NewClientForm } from "@/components/clients/NewClientForm";
import type { Client } from "@/lib/types/client/types";

interface ClientSelectProps {
  clients: Client[];
  selectedId: number | null;
  isLoading: boolean;
  onSelect: (client: Client) => void;
  createClient: (data: { name: string; phone: string; email: string }) => Promise<Client>;
}

export function ClientSelect({ clients, selectedId, isLoading, onSelect, createClient }: ClientSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"list" | "new">("list");

  const selected = clients.find((c) => c.id === selectedId);

  return (
    <SelectDropdown
      label="Cliente"
      required
      displayValue={selected ? selected.name : "Selecciona un cliente"}
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
      icon={<UserPlus size={16} />}
    >
      {view === "new" ? (
        <NewClientForm
          onBack={() => setView("list")}
          createClient={createClient}
          onCreated={(client) => {
            onSelect(client);
            setView("list");
            setIsOpen(false);
          }}
        />
      ) : (
        <>
          <div className="max-h-40 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-neutral-400" />
              </div>
            ) : clients.length === 0 ? (
              <p className="px-4 py-3 text-sm text-neutral-400">No hay clientes aún</p>
            ) : (
              clients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => { onSelect(client); setIsOpen(false); }}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-3 ${
                    selectedId === client.id ? "bg-primary-50 text-primary-700" : "text-neutral-700"
                  }`}
                >
                  <ClientAvatar name={client.name} size="sm" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{client.name}</p>
                    {client.email && <p className="text-xs text-neutral-400 truncate">{client.email}</p>}
                  </div>
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
              Crear nuevo cliente
            </button>
          </div>
        </>
      )}
    </SelectDropdown>
  );
}
