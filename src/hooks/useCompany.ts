"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

interface CompanyData {
  id: number;
  name: string;
  address: string;
  description: string;
  companyImage: string | null;
}

export function useCompany() {
  const { user, isLoading: isUserLoading } = useUser();
  const [company, setCompany] = useState<CompanyData | null>(null);
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

        const data = await res.json();
        setCompany(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, [isUserLoading, user?.email]);

  return {
    companyId: company?.id ?? null,
    companyName: company?.name ?? "",
    companyImage: company?.companyImage ?? null,
    companyAddress: company?.address ?? "",
    companyDescription: company?.description ?? "",
    isLoading: isLoading || isUserLoading,
    error,
    userName: user?.name ?? "",
  };
}
