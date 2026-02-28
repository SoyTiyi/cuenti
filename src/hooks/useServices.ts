"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Service,
  ServiceWithStats,
  CreateServiceDTO,
  UpdateServiceDTO,
} from "@/lib/types/service/types";

function toServiceWithStats(service: Service): ServiceWithStats {
  return {
    ...service,
    salesCount: 0,
    totalRevenue: 0,
    lastSaleDate: null,
  };
}

export function useServices(companyId: number | null) {
  const [services, setServices] = useState<ServiceWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    async function fetchServices() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/service/company/${companyId}`);
        if (!res.ok) throw new Error("Error al cargar los servicios");
        const data: ServiceWithStats[] = await res.json();
        setServices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, [companyId]);

  const createService = useCallback(
    async (data: Omit<CreateServiceDTO, "companyId">): Promise<Service> => {
      if (!companyId) throw new Error("No company selected");
      const res = await fetch(`/api/service/company/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, companyId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Error al crear el servicio");
      }
      const newService: Service = await res.json();
      const withStats = toServiceWithStats(newService);
      setServices((prev) => [withStats, ...prev]);
      return newService;
    },
    [companyId]
  );

  const updateService = useCallback(
    async (id: number, data: UpdateServiceDTO): Promise<void> => {
      const res = await fetch(`/api/service/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Error al actualizar el servicio");
      }
      const updated: Service = await res.json();
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
      );
    },
    []
  );

  const deleteService = useCallback(async (id: number): Promise<void> => {
    const res = await fetch(`/api/service/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Error al eliminar el servicio");
    }
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { services, isLoading, error, createService, updateService, deleteService };
}
