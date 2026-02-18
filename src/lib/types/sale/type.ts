export interface Sale {
    id: number;
    amount: number;
    isPaid: boolean;
    paymentDate: string | null;
    dueDate: string | null;
    notes: string;
    clientId: number;
    serviceId: number;
    createdAt: string;
    updatedAt: string;
}