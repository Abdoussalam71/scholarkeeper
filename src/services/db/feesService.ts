
import db from './database';
import { ClassFees, PaymentPlan, PaymentReceipt } from '@/types/fees';

export const feesService = {
  initDatabase: async () => {
    // Initialiser les plans de paiement s'ils n'existent pas
    const plansCount = await db.table('paymentPlans').count();
    
    if (plansCount === 0) {
      const defaultPlans: PaymentPlan[] = [
        {
          id: "plan-1",
          name: "Paiement intégral",
          description: "Paiement de tous les frais en une seule fois",
          instalments: 1
        },
        {
          id: "plan-2",
          name: "Paiement trimestriel",
          description: "Paiement des frais en trois versements trimestriels",
          instalments: 3
        }
      ];
      
      await db.table('paymentPlans').bulkAdd(defaultPlans);
    }
  },
  
  // Méthodes pour gérer les frais par classe
  getAllClassFees: async (): Promise<ClassFees[]> => {
    return await db.table('classFees').toArray();
  },
  
  getClassFeesById: async (id: string): Promise<ClassFees | undefined> => {
    return await db.table('classFees').get(id);
  },
  
  getClassFeesByClassId: async (classId: string): Promise<ClassFees | undefined> => {
    return await db.table('classFees')
      .filter(fee => fee.classId === classId)
      .first();
  },
  
  addClassFees: async (fees: Omit<ClassFees, "id">): Promise<ClassFees> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newFees = { 
      id, 
      ...fees,
      termAmount: Math.ceil(fees.yearlyAmount / 3) // Calcul automatique du montant par trimestre
    };
    
    await db.table('classFees').add(newFees);
    return newFees;
  },
  
  updateClassFees: async (id: string, fees: Omit<ClassFees, "id">): Promise<ClassFees> => {
    const updatedFees = { 
      id, 
      ...fees,
      termAmount: Math.ceil(fees.yearlyAmount / 3) // Recalcul du montant par trimestre
    };
    
    await db.table('classFees').update(id, updatedFees);
    return updatedFees;
  },
  
  deleteClassFees: async (id: string): Promise<boolean> => {
    await db.table('classFees').delete(id);
    return true;
  },
  
  // Méthodes pour gérer les plans de paiement
  getAllPaymentPlans: async (): Promise<PaymentPlan[]> => {
    return await db.table('paymentPlans').toArray();
  },
  
  // Méthodes pour gérer les reçus de paiement
  getAllReceipts: async (): Promise<PaymentReceipt[]> => {
    return await db.table('receipts').toArray();
  },
  
  getReceiptsByStudentId: async (studentId: string): Promise<PaymentReceipt[]> => {
    return await db.table('receipts')
      .filter(receipt => receipt.studentId === studentId)
      .toArray();
  },
  
  getReceiptById: async (id: string): Promise<PaymentReceipt | undefined> => {
    return await db.table('receipts').get(id);
  },
  
  addReceipt: async (receipt: Omit<PaymentReceipt, "id">): Promise<PaymentReceipt> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newReceipt = { id, ...receipt };
    
    await db.table('receipts').add(newReceipt);
    return newReceipt;
  },
  
  // Génère un numéro de reçu unique
  generateReceiptNumber: async (): Promise<string> => {
    const count = await db.table('receipts').count();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    return `RECU-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
  },
  
  // Génère un ID de transaction unique
  generateTransactionId: (): string => {
    const date = new Date();
    const timestamp = date.getTime();
    const random = Math.floor(Math.random() * 10000);
    
    return `TRX-${timestamp}-${random}`;
  }
};
