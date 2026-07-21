export interface ClienteMbDto {
  id: number;
  fullName: string;
  city: string | null;
  registrationDate: string | null;
  debt: number;
  payment: number;
  totalAmount: number;
  discount: boolean | null;
  status: string;
}

export interface ClientCreateRequest {
  firstName: string;
  lastName: string;
  city?: string;
  registrationDate?: string;
  initialDebt?: number;
  discount?: boolean;
}

export interface ClientUpdateRequest {
  firstName: string;
  lastName: string;
  city?: string;
  registrationDate?: string;
  discount?: boolean;
}

export interface ClientChargeRequest {
  amount: number;
  description?: string;
}

export interface ClientPaymentRequest {
  amount: number;
  description?: string;
  reference?: string;
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  cancelledClients: number;
  totalDebt: number;
  totalPayment: number;
  totalOutstanding: number;
}
