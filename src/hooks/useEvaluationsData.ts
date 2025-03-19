
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { evaluationService } from "@/services/db/evaluationService";
import { Evaluation } from "@/types/evaluations";
import { toast } from "sonner";

export function useEvaluationsData(classId?: string, courseId?: string) {
  const queryClient = useQueryClient();
  
  // Initialize the database on first load
  useQuery({
    queryKey: ["evaluationsInit"],
    queryFn: async () => {
      await evaluationService.initEvaluations();
      return true;
    },
    staleTime: Infinity
  });
  
  // Get evaluations data
  const { data: evaluations = [], isLoading, error } = useQuery({
    queryKey: ["evaluations", classId, courseId],
    queryFn: async () => {
      if (classId) {
        return evaluationService.getEvaluationsByClassId(classId);
      } else if (courseId) {
        return evaluationService.getEvaluationsByCourseId(courseId);
      }
      return evaluationService.getAllEvaluations();
    }
  });
  
  // Add a new evaluation
  const addEvaluationMutation = useMutation({
    mutationFn: (newEvaluation: Omit<Evaluation, "id">) => 
      evaluationService.addEvaluation(newEvaluation),
    onSuccess: () => {
      toast.success("Évaluation ajoutée avec succès");
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout de l'évaluation");
    }
  });
  
  // Update an existing evaluation
  const updateEvaluationMutation = useMutation({
    mutationFn: (evaluation: Evaluation) => 
      evaluationService.updateEvaluation(evaluation),
    onSuccess: () => {
      toast.success("Évaluation mise à jour");
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  });
  
  // Delete an evaluation
  const deleteEvaluationMutation = useMutation({
    mutationFn: (id: string) => 
      evaluationService.deleteEvaluation(id),
    onSuccess: () => {
      toast.success("Évaluation supprimée");
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  });
  
  return {
    evaluations,
    isLoading,
    error,
    addEvaluation: (evaluation: Omit<Evaluation, "id">) => 
      addEvaluationMutation.mutate(evaluation),
    updateEvaluation: (evaluation: Evaluation) => 
      updateEvaluationMutation.mutate(evaluation),
    deleteEvaluation: (id: string) => 
      deleteEvaluationMutation.mutate(id)
  };
}
