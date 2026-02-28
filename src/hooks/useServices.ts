"use client";

import { useState, useEffect, useCallback } from "react";
import { Service, CreateServiceDTO } from "@/lib/types/service/types";

export function useServices(companyId: number | null) {
  const [services, setServices] = useState<Service[]>([]);
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
        const data = await res.json();
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
    async (data: Omit<CreateServiceDTO, "companyId">): Promise<Service | null> => {
      if (!companyId) return null;
      try {
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
        setServices((prev) => [...prev, newService]);
        return newService;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    [companyId]
  );

  return { services, isLoading, error, createService };
}
