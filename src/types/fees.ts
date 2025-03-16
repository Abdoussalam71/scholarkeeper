
export interface ClassFees {
  id: string;
  classId: string;
  className: string;
  yearlyAmount: number;
  registrationFee: number;
  termAmount: number; // Montant par trimestre (calculé automatiquement)
  academicYear: string;
}

export interface PaymentPlan {
  id: string;
  name: "Paiement intégral" | "Paiement trimestriel" | "Paiement flexible";
  description: string;
  instalments: number; // 1 pour intégral, 3 pour trimestriel, 0 pour flexible
}

export interface PaymentReceipt {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  remainingBalance: number;
  academicYear: string;
  receiptNumber: string;
  paymentPlanId: string;
  termNumber?: number; // Pour les paiements trimestriels
  discountPercentage: number;
  originalAmount: number;
  finalAmount: number;
  status: "payé" | "en attente" | "retard";
  isFullPayment: boolean; // Indique si le paiement a soldé le compte
}
