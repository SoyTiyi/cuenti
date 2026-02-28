"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export function useCompany() {
  const { user, isLoading: isUserLoading } = useUser();
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isUserLoading || !user?.email) return;

    async function fetchCompany() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/company/email", {
          headers: { email: user!.email! },
        });

        if (!res.ok) throw new Error("Error al obtener la empresa");

        const company = await res.json();
        setCompanyId(company.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, [isUserLoading, user?.email]);

  return { companyId, isLoading: isLoading || isUserLoading, error };
}
