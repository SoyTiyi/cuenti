"use client";

import { useState, useEffect, useCallback } from "react";
import { Client, ClientWithStats, CreateClientDTO } from "@/lib/types/client/types";

function computeClientStats(client: Client): ClientWithStats {
  const totalSpent = client.sales.reduce((acc, s) => acc + Number(s.amount), 0);
  const pendingAmount = client.sales
    .filter((s) => !s.isPaid)
    .reduce((acc, s) => acc + (Number(s.amount) - Number(s.paidAmount)), 0);
  const visitCount = client.sales.length;
  const lastVisit = client.sales.length > 0 ? client.sales[0].saleDate : null;

  return { ...client, totalSpent, pendingAmount, visitCount, lastVisit };
}

export function useClients(companyId: number | null) {
  const [clients, setClients] = useState<ClientWithStats[]>([]);
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
        const data: Client[] = await res.json();
        setClients(data.map(computeClientStats));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchClients();
  }, [companyId]);

  const createClient = useCallback(
    async (data: Omit<CreateClientDTO, "companyId">): Promise<Client> => {
      if (!companyId) throw new Error("No company found");
      const res = await fetch(`/api/client/company/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, companyId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Error al crear el cliente");
      }
      const newClient: Client = await res.json();
      const withStats = computeClientStats(newClient);
      setClients((prev) => [withStats, ...prev]);
      return newClient;
    },
    [companyId]
  );

  return { clients, isLoading, error, createClient };
}
