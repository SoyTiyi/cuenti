// import { useState, useEffect, use } from "react";
// import { z } from "zod";
// import { CreateClientDTO } from '@/lib/types/client/types'

// const newUserSchema = z.object({
//   name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
//   phone: z.string().min(1, "El teléfono es requerido").max(20, "El teléfono no puede exceder 20 caracteres"),
//   email: z.string().email("El correo electrónico no es válido").max(100, "El correo electrónico no puede exceder 100 caracteres"),
// });

// export function useSales() {
//   const [clientId, setClientId] = useState<number | null>(null);
//   const [serviceId, setServiceId] = useState<number | null>(null);
//   const [amount, setAmount] = useState("");
//   const [saleDate, setSaleDate] = useState(
//     new Date().toISOString().split("T")[0],
//   );
//   const [dueDate, setDueDate] = useState("");
//   const [notes, setNotes] = useState("");
//   const [showClientDropdown, setShowClientDropdown] = useState(false);
//   const [showServiceDropdown, setShowServiceDropdown] = useState(false);
//   const [clients, setClients] = useState([]);
//   const [isCreatingClient, setIsCreatingClient] = useState(false);
//   const [clientName, setClientName] = useState('');
//   const [clientPhone, setClientPhone] = useState('');
//   const [clientEmail, setClientEmail] = useState('');
//   const [services, setServices] = useState([]);
//   const [fieldErrors, setFieldErrors] = useState<{
//     name?: string;
//     phone?: string;
//     email?: string;
//   }>({});
//   const [submitNewClientError, setSubmitNewClientError] = useState(false);
//   const [isSubmittingNewClient, setIsSubmittingNewClient] = useState(true);


//   useEffect(() => {
//     async function fetchClients() {
//       try {
//         const response = await fetch("/api/client/company");

//         if (!response.ok) {
//           throw new Error("Error al cargar los clientes");
//         }

//         const data = await response.json();
//         setClients(data);
//       } catch (error) {
//         console.error(
//           error instanceof Error ? error.message : "Error desconocido",
//         );
//       }
//     }

//     async function fetchServices() {
//       try {
//         const response = await fetch("/api/service/company");

//         if (!response.ok) {
//           throw new Error("Error al cargar los servicios");
//         }

//         const data = await response.json();
//         setServices(data);
//       } catch (error) {
//         console.error(
//           error instanceof Error ? error.message : "Error desconocido",
//         );
//       }
//     }

//     fetchClients();

//     fetchServices();
//   }, []);

//   const validateNewClient = () => {
//     const result = newUserSchema.safeParse({
//       clientName,
//       clientPhone,
//       clientEmail
//     });

//     if (!result.success) {
//       const errors: Record<string, string> = {}
//       result.error.issues.forEach((issue) => {
//         const field = issue.path[0] as string;
//         if (field) {
//           errors[field] = issue.message
//         }
//       });

//       setFieldErrors(errors);
//       return false;
//     }


    
//   }

//   const createNewUser = async () => {
//     try {
//       const isValid = validateNewClient();

//       if (!isValid) {
//         setSubmitNewClientError(true)
//         return;
//       }

//       try {
//         setIsSubmittingNewClient(true);
//         setSubmitNewClientError(false);

//         const company = await fetch ("api/company/email", {
//           method: "POST",
//           headers: {
//             'email': 
//           }
//         })

//         const data: CreateClientDTO = {
//           clientName,
//           clientPhone,
//           clientEmail,
//           companyId
//         }
//       }
//     }
//   }
// }
