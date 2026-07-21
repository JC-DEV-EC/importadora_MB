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
  phone: string | null;
  email: string | null;
  cedula: string | null;
}

export interface ClientCreateRequest {
  firstName: string;
  lastName: string;
  city?: string;
  registrationDate?: string;
  initialDebt?: number;
  discount?: boolean;
  phone?: string;
  email?: string;
  cedula?: string;
}

export interface ClientUpdateRequest {
  firstName: string;
  lastName: string;
  city?: string;
  registrationDate?: string;
  discount?: boolean;
  phone?: string;
  email?: string;
  cedula?: string;
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
