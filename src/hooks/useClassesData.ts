
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { classService } from "@/services/database";
import { ClassData, StudyLevel } from "@/types/classes";
import { toast } from "sonner";

export function useClassesData(searchQuery: string = "", level?: StudyLevel) {
  const queryClient = useQueryClient();
  
  // Initialize the database on first load
  useQuery({
    queryKey: ["classesInit"],
    queryFn: async () => {
      await classService.initDatabase();
      return true;
    },
    staleTime: Infinity
  });
  
  // Get classes data
  const { data: classes = [], isLoading, error } = useQuery({
    queryKey: ["classes", searchQuery, level],
    queryFn: async () => {
      if (level) {
        const allClasses = await classService.getClassesByLevel(level);
        if (searchQuery) {
          return allClasses.filter(cls => 
            cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cls.description && cls.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        return allClasses;
      }
      
      if (searchQuery) {
        return classService.searchClasses(searchQuery);
      }
      return classService.getAllClasses();
    }
  });
  
  // Add a new class
  const addClassMutation = useMutation({
    mutationFn: (newClass: Omit<ClassData, "id">) => {
      // Ensure students array is initialized if not provided
      const classWithStudents = {
        ...newClass,
        students: newClass.students || []
      };
      return classService.addClass(classWithStudents);
    },
    onSuccess: () => {
      toast.success("Classe ajoutée avec succès");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de la classe");
    }
  });
  
  // Update an existing class
  const updateClassMutation = useMutation({
    mutationFn: (classData: ClassData) => 
      classService.updateClass(classData),
    onSuccess: () => {
      toast.success("Classe mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la classe");
    }
  });
  
  // Delete a class
  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => 
      classService.deleteClass(id),
    onSuccess: () => {
      toast.success("Classe supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la classe");
    }
  });
  
  return {
    classes,
    isLoading,
    error,
    addClass: (classData: Omit<ClassData, "id">) => addClassMutation.mutate(classData),
    updateClass: (classData: ClassData) => updateClassMutation.mutate(classData),
    deleteClass: (id: string) => deleteClassMutation.mutate(id)
  };
}
