"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useCompany } from "@/hooks/useCompany";
import { useClients } from "@/hooks/useClients";
import { ClientStats, ClientCharts, ClientList, ClientDetail, NewClientForm } from "@/components/clients";
import type { ClientWithStats } from "@/lib/types/client/types";

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<ClientWithStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { companyId, isLoading: isCompanyLoading } = useCompany();
  const { clients, isLoading: isClientsLoading, createClient } = useClients(companyId);

  const isLoading = isCompanyLoading || isClientsLoading;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Clientes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors cursor-pointer"
        >
          <UserPlus size={18} />
          Nueva Cliente
        </button>
      </div>

      <ClientStats clients={clients} isLoading={isLoading} />

      {!isLoading && clients.length > 0 && (
        <ClientCharts clients={clients} />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : (
        <ClientList clients={clients} onClientClick={setSelectedClient} />
      )}

      {/* New client modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100">
              <h2 className="text-xl font-semibold text-neutral-900">Nueva cliente</h2>
              <p className="text-sm text-neutral-500 mt-0.5">Agrega una nueva cliente a tu lista</p>
            </div>
            <div className="px-6 py-5">
              <NewClientForm
                onBack={() => setIsModalOpen(false)}
                createClient={createClient}
                onCreated={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <ClientDetail
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </div>
  );
}
