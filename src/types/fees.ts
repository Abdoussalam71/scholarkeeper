
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
  name: "Paiement flexible";
  description: string;
  instalments: number; // 0 pour flexible
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
  discountPercentage: number;
  originalAmount: number;
  finalAmount: number;
  status: "payé" | "en attente" | "retard";
  isFullPayment: boolean; // Indique si le paiement a soldé le compte
  termNumber?: number; // Ajout du numéro de trimestre (optionnel)
}
