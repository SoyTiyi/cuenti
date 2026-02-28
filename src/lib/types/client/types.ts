export interface CreateClientDTO {
  name: string;
  phone: string;
  email: string;
  companyId: number;
}

export interface ClientSaleSummary {
  id: number;
  amount: number;
  isPaid: boolean;
  paidAmount: number;
  saleDate: string;
  service: { id: number; name: string; price: number };
}

export interface Client {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  companyId: number;
  sales: ClientSaleSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientWithStats extends Client {
  totalSpent: number;
  pendingAmount: number;
  visitCount: number;
  lastVisit: string | null;
}
