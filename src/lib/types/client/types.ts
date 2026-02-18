import { Sale } from "../sale/type";

export interface CreateClientDTO {
    name: string;
    phone: string;
    email: string;
    companyId: number;
}

export interface Client {
    id: number;
    name: string;
    phone: string;
    email: string;
    companyId: number;
    sales: Sale[];
    createdAt: string;
    updatedAt: string;
}