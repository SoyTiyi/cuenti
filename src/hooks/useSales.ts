"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { z } from "zod";
import { Client, CreateClientDTO } from "@/lib/types/client/types";
import { Service } from "@/lib/types/service/types";

const newClientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  phone: z.string().min(1, "El teléfono es requerido").max(20, "El teléfono no puede exceder 20 caracteres"),
  email: z.string().email("El correo electrónico no es válido").max(100, "El correo electrónico no puede exceder 100 caracteres"),
});

export function useSales() {
  const { user, isLoading: isUserLoading } = useUser();

  const [companyId, setCompanyId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});
  const [isSubmittingNewClient, setIsSubmittingNewClient] = useState(false);
  const [submitNewClientError, setSubmitNewClientError] = useState(false);

  useEffect(() => {
    if (isUserLoading || !user?.email) return;

    async function fetchInitialData() {
      try {
        setIsLoading(true);
        setError(null);

        const companyResponse = await fetch("/api/company/email", {
          method: "GET",
          headers: { email: user!.email! },
        });

        if (!companyResponse.ok) {
          throw new Error("Error al obtener la empresa");
        }

        const company = await companyResponse.json();
        setCompanyId(company.id);

        const [clientsResponse, servicesResponse] = await Promise.all([
          fetch(`/api/client/company/${company.id}`),
          fetch(`/api/service/company/${company.id}`),
        ]);

        if (!clientsResponse.ok) {
          throw new Error("Error al cargar los clientes");
        }

        if (!servicesResponse.ok) {
          throw new Error("Error al cargar los servicios");
        }

        const [clientsData, servicesData] = await Promise.all([
          clientsResponse.json(),
          servicesResponse.json(),
        ]);

        setClients(clientsData);
        setServices(servicesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [isUserLoading, user?.email]);

  const validateNewClient = (): boolean => {
    const result = newClientSchema.safeParse({
      name: clientName,
      phone: clientPhone,
      email: clientEmail,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const createNewClient = async () => {
    const isValid = validateNewClient();

    if (!isValid) {
      setSubmitNewClientError(true);
      return;
    }

    if (!companyId) {
      setSubmitNewClientError(true);
      return;
    }

    try {
      setIsSubmittingNewClient(true);
      setSubmitNewClientError(false);

      const data: CreateClientDTO = {
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
        companyId,
      };

      const response = await fetch(`/api/client/company/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al crear el cliente");
      }

      const newClient = await response.json();
      setClients((prev) => [...prev, newClient]);

      setClientName("");
      setClientPhone("");
      setClientEmail("");
      setFieldErrors({});
    } catch (err) {
      console.error(err);
      setSubmitNewClientError(true);
    } finally {
      setIsSubmittingNewClient(false);
    }
  };

  return {
    clients,
    services,
    isLoading: isLoading || isUserLoading,
    error,
    companyId,

    clientName,
    setClientName,
    clientPhone,
    setClientPhone,
    clientEmail,
    setClientEmail,
    fieldErrors,
    isSubmittingNewClient,
    submitNewClientError,

    validateNewClient,
    createNewClient,
  };
}
