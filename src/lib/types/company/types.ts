export interface BusinessHours {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

export interface Company {
  id: number;
  name: string;
  address: string;
  description: string;
  companyImage: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  taxId: string | null;
  taxName: string | null;
  currency: string;
  timezone: string;
  businessHours: BusinessHours | null;
  paymentMethods: string[];
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCompanyDTO {
  name: string;
  address: string;
  description: string;
  companyImage?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  taxId?: string | null;
  taxName?: string | null;
  currency: string;
  timezone: string;
  businessHours?: BusinessHours | null;
  paymentMethods: string[];
}

export const CURRENCIES = [
  { code: "CLP", name: "Peso Chileno", symbol: "$" },
  { code: "ARS", name: "Peso Argentino", symbol: "$" },
  { code: "MXN", name: "Peso Mexicano", symbol: "$" },
  { code: "USD", name: "Dólar Americano", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "COP", name: "Peso Colombiano", symbol: "$" },
  { code: "PEN", name: "Sol Peruano", symbol: "S/" },
] as const;

export const TIMEZONES = [
  { value: "America/Santiago", label: "Santiago, Chile" },
  { value: "America/Buenos_Aires", label: "Buenos Aires, Argentina" },
  { value: "America/Mexico_City", label: "Ciudad de México, México" },
  { value: "America/Bogota", label: "Bogotá, Colombia" },
  { value: "America/Lima", label: "Lima, Perú" },
  { value: "America/Caracas", label: "Caracas, Venezuela" },
  { value: "America/Montevideo", label: "Montevideo, Uruguay" },
  { value: "America/Asuncion", label: "Asunción, Paraguay" },
] as const;

export const PAYMENT_METHODS = [
  { id: "cash", label: "Efectivo", icon: "Banknote" },
  { id: "transfer", label: "Transferencia bancaria", icon: "ArrowLeftRight" },
  { id: "credit_card", label: "Tarjeta de crédito/débito", icon: "CreditCard" },
  { id: "mercadopago", label: "MercadoPago", icon: "Wallet" },
  { id: "paypal", label: "PayPal", icon: "Globe" },
  { id: "yape", label: "Yape", icon: "Smartphone" },
  { id: "plin", label: "Plin", icon: "Smartphone" },
] as const;

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { open: "09:00", close: "18:00", isOpen: true },
  tuesday: { open: "09:00", close: "18:00", isOpen: true },
  wednesday: { open: "09:00", close: "18:00", isOpen: true },
  thursday: { open: "09:00", close: "18:00", isOpen: true },
  friday: { open: "09:00", close: "18:00", isOpen: true },
  saturday: { open: "10:00", close: "14:00", isOpen: true },
  sunday: { open: "09:00", close: "18:00", isOpen: false },
};
