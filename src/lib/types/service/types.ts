export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceWithStats extends Service {
    salesCount: number;
    totalRevenue: number;
    lastSaleDate: string | null;
}

export interface CreateServiceDTO {
    name: string;
    description: string;
    price: number;
    companyId: number;
}

export interface UpdateServiceDTO {
    name: string;
    description: string;
    price: number;
}