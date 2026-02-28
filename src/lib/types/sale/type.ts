export interface Sale {
  id: number;
  amount: number;
  isPaid: boolean;
  paidAmount: number;
  paymentDate: string | null;
  dueDate: string | null;
  saleDate: string;
  notes: string | null;
  clientId: number;
  serviceId: number;
  companyId: number;
  client: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
  };
  service: {
    id: number;
    name: string;
    price: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleDTO {
  clientId: number;
  serviceId: number;
  companyId: number;
  amount: number;
  saleDate: string;
  dueDate?: string | null;
  notes?: string | null;
}

export interface SaleStats {
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  monthSalesCount: number;
  pendingSalesCount: number;
}

export interface SalesChartDay {
  day: string;
  sales: number;
}

export interface TopService {
  name: string;
  quantity: number;
  color: string;
}
