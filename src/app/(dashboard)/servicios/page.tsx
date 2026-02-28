"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { useCompany } from "@/hooks/useCompany";
import { useServices } from "@/hooks/useServices";

import {
  ServiceStats,
  ServiceList,
  ServiceDetail,
  ServiceFormModal,
} from "@/components/services";
import type { ServiceWithStats } from "@/lib/types/service/types";

export default function ServiciosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceWithStats | null>(null);
  const [editingService, setEditingService] = useState<ServiceWithStats | null>(null);

  const { companyId, isLoading: isCompanyLoading } = useCompany();
  const { services, isLoading: isServicesLoading, createService, updateService, deleteService } = useServices(companyId);

  const isPageLoading = isCompanyLoading || isServicesLoading;

  const handleEdit = (service: ServiceWithStats) => {
    setSelectedService(null);
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleOpenNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <h1 className="text-2xl font-bold text-neutral-900">Servicios</h1>
        <button
          onClick={handleOpenNew}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors cursor-pointer"
        >
          + Nuevo Servicio
        </button>
      </div>

      <ServiceStats services={services} isLoading={isPageLoading} />

      {isPageLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : (
        <ServiceList services={services} onServiceClick={setSelectedService} />
      )}

      <ServiceDetail
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onEdit={handleEdit}
        onDelete={deleteService}
      />

      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={editingService}
        createService={createService}
        updateService={updateService}
      />
    </div>
  );
}
