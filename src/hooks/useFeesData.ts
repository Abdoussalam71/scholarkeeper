
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feesService } from "@/services/db/feesService";
import { ClassFees, PaymentPlan, PaymentReceipt } from "@/types/fees";
import { toast } from "sonner";

export function useFeesData() {
  const queryClient = useQueryClient();
  
  // Initialize the database on first load
  useQuery({
    queryKey: ["feesInit"],
    queryFn: async () => {
      await feesService.initDatabase();
      return true;
    },
    staleTime: Infinity
  });
  
  // Get all class fees
  const { data: classFees = [], isLoading: isLoadingFees } = useQuery({
    queryKey: ["classFees"],
    queryFn: () => feesService.getAllClassFees()
  });
  
  // Get payment plans
  const { data: paymentPlans = [] } = useQuery({
    queryKey: ["paymentPlans"],
    queryFn: () => feesService.getAllPaymentPlans()
  });
  
  // Add class fees
  const addClassFeesMutation = useMutation({
    mutationFn: (fees: Omit<ClassFees, "id">) => feesService.addClassFees(fees),
    onSuccess: () => {
      toast.success("Frais de scolarité ajoutés avec succès");
      queryClient.invalidateQueries({ queryKey: ["classFees"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout des frais de scolarité");
    }
  });
  
  // Update class fees
  const updateClassFeesMutation = useMutation({
    mutationFn: ({ id, fees }: { id: string; fees: Omit<ClassFees, "id"> }) => 
      feesService.updateClassFees(id, fees),
    onSuccess: () => {
      toast.success("Frais de scolarité mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["classFees"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des frais de scolarité");
    }
  });
  
  // Delete class fees
  const deleteClassFeesMutation = useMutation({
    mutationFn: (id: string) => feesService.deleteClassFees(id),
    onSuccess: () => {
      toast.success("Frais de scolarité supprimés avec succès");
      queryClient.invalidateQueries({ queryKey: ["classFees"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression des frais de scolarité");
    }
  });
  
  // Generate and add payment receipt
  const addReceiptMutation = useMutation({
    mutationFn: async (data: Omit<PaymentReceipt, "id" | "receiptNumber" | "transactionId">) => {
      const receiptNumber = await feesService.generateReceiptNumber();
      const transactionId = feesService.generateTransactionId();
      
      return feesService.addReceipt({
        ...data,
        receiptNumber,
        transactionId
      });
    },
    onSuccess: () => {
      toast.success("Paiement enregistré avec succès");
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      queryClient.invalidateQueries({ queryKey: ["studentPayments"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement du paiement");
    }
  });
  
  // Update payment status mutation
  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentReceipt["status"] }) => 
      feesService.updateReceiptStatus(id, status),
    onSuccess: () => {
      toast.success("Statut du paiement mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
      queryClient.invalidateQueries({ queryKey: ["studentPayments"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du statut du paiement");
    }
  });
  
  // Get receipts by student ID
  const getReceiptsByStudentId = (studentId: string) => {
    return useQuery({
      queryKey: ["receipts", studentId],
      queryFn: () => feesService.getReceiptsByStudentId(studentId)
    });
  };
  
  // Get all receipts
  const { data: allReceipts = [], isLoading: isLoadingReceipts } = useQuery({
    queryKey: ["receipts"],
    queryFn: () => feesService.getAllReceipts()
  });
  
  return {
    classFees,
    paymentPlans,
    allReceipts,
    isLoadingFees,
    isLoadingReceipts,
    addClassFees: (fees: Omit<ClassFees, "id">) => addClassFeesMutation.mutate(fees),
    updateClassFees: (id: string, fees: Omit<ClassFees, "id">) => 
      updateClassFeesMutation.mutate({ id, fees }),
    deleteClassFees: (id: string) => deleteClassFeesMutation.mutate(id),
    addReceipt: (data: Omit<PaymentReceipt, "id" | "receiptNumber" | "transactionId">) => 
      addReceiptMutation.mutate(data),
    updatePaymentStatus: (id: string, status: PaymentReceipt["status"]) => 
      updatePaymentStatusMutation.mutate({ id, status }),
    getReceiptsByStudentId
  };
}
