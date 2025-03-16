
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
  
  // Calculer le total payé pour l'année académique en cours
  const currentAcademicYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  
  const totalPaid = studentPayments
    .filter(payment => payment.academicYear === currentAcademicYear && payment.status === "payé")
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  // Obtenir le dernier paiement pour connaître le solde restant
  const sortedPayments = [...studentPayments]
    .filter(payment => payment.academicYear === currentAcademicYear)
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  
  // Calculer le total dû (solde restant du dernier paiement)
  const totalDue = sortedPayments.length > 0 ? sortedPayments[0].remainingBalance : 0;
  
  // Déterminer si l'étudiant a des paiements en retard
  const hasLatePayments = studentPayments.some(payment => payment.status === "retard");
  
  // Déterminer si l'étudiant a des paiements en attente
  const hasPendingPayments = studentPayments.some(payment => payment.status === "en attente");
  
  // Obtenir le dernier paiement
  const lastPayment = sortedPayments.length > 0 ? sortedPayments[0] : null;
  
  // Déterminer si le compte est soldé
  const isAccountSettled = totalDue === 0 && totalPaid > 0;
  
  // Récupérer tous les paiements en attente
  const pendingPayments = studentPayments.filter(payment => payment.status === "en attente");
  
  return {
    studentPayments,
    totalPaid,
    totalDue,
    hasLatePayments,
    hasPendingPayments,
    pendingPayments,
    lastPayment,
    isAccountSettled,
    isLoading,
    error
  };
}
