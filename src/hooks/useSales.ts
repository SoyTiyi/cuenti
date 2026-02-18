import { useState, useEffect, use } from "react";

export function useSales() {
  const [clientId, setClientId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [clients, setClients] = useState([]);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    email: "",
  });
  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await fetch("/api/client/company");

        if (!response.ok) {
          throw new Error("Error al cargar los clientes");
        }

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error(
          error instanceof Error ? error.message : "Error desconocido",
        );
      }
    }

    fetchClients();
  }, []);
}
