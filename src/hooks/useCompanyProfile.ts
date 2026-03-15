"use client";

import { useState, useEffect, useCallback } from "react";
import { Company, UpdateCompanyDTO } from "@/lib/types/company/types";

export function useCompanyProfile(companyId: number | null) {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) return;

    async function fetchCompany() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/company/${companyId}`);
        if (!res.ok) throw new Error("Error al cargar la empresa");
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, [companyId]);

  const updateCompany = useCallback(
    async (data: UpdateCompanyDTO): Promise<Company | null> => {
      if (!companyId) return null;
      try {
        const res = await fetch(`/api/company/${companyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Error al actualizar");
        const updated = await res.json();
        setCompany(updated);
        return updated;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    [companyId]
  );

  return { company, isLoading, error, updateCompany };
}
