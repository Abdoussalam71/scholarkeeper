
import { useQuery } from "@tanstack/react-query";
import { feesService } from "@/services/db/feesService";
import { PaymentReceipt } from "@/types/fees";

export function useStudentPayments(studentId: string) {
  // Récupérer tous les paiements d'un étudiant
  const { data: studentPayments = [], isLoading, error } = useQuery({
    queryKey: ["studentPayments", studentId],
    queryFn: async () => {
      if (!studentId) return [];
      return feesService.getReceiptsByStudentId(studentId);
    },
    enabled: !!studentId
  });
  
  // Calculer le total payé
  const totalPaid = studentPayments.reduce((sum, payment) => {
    if (payment.status === "payé") {
      return sum + payment.amount;
    }
    return sum;
  }, 0);
  
  // Calculer le total dû
  const totalDue = studentPayments.reduce((sum, payment) => {
    return sum + payment.remainingBalance;
  }, 0);
  
  // Déterminer si l'étudiant a des paiements en retard
  const hasLatePayments = studentPayments.some(payment => payment.status === "retard");
  
  // Obtenir le dernier paiement
  const lastPayment = studentPayments.length > 0 
    ? studentPayments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0]
    : null;
  
  return {
    studentPayments,
    totalPaid,
    totalDue,
    hasLatePayments,
    lastPayment,
    isLoading,
    error
  };
}
