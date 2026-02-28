"use client";

import { useState, useEffect, useCallback } from "react";
import { Client, CreateClientDTO } from "@/lib/types/client/types";

export function useClients(companyId: number | null) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    async function fetchClients() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/client/company/${companyId}`);
        if (!res.ok) throw new Error("Error al cargar los clientes");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, [companyId]);

  const createClient = useCallback(
    async (data: Omit<CreateClientDTO, "companyId">): Promise<Client | null> => {
      if (!companyId) return null;
      try {
        const res = await fetch(`/api/client/company/${companyId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, companyId }),
        });
        if (!res.ok) throw new Error("Error al crear el cliente");
        const newClient: Client = await res.json();
        setClients((prev) => [...prev, newClient]);
        return newClient;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [companyId]
  );

  return { clients, isLoading, error, createClient };
}
