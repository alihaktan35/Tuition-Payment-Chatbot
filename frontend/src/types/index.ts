export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  data?: TuitionData | PaymentData | UnpaidData;
  messageType?: 'greeting' | 'tuition_info' | 'payment_success' | 'unpaid_list' | 'error' | 'clarification';
}

export interface TuitionData {
  studentNo?: string;
  name?: string;
  term?: string;
  totalAmount?: number;
  balance?: number;
  paidAmount?: number;
  status?: string;
}

export interface PaymentData {
  studentNo?: string;
  term?: string;
  amount?: number;
  remainingBalance?: number;
  transactionRef?: string;
  status?: string;
}

export interface UnpaidData {
  term?: string;
  students?: Array<{
    studentNo: string;
    name: string;
    balance: number;
    totalAmount: number;
  }>;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}
