export interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateServiceDTO {
    name: string;
    description: string;
    price: number;
    companyId: number;
}