
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@/services/database";
import { TeacherData } from "@/types/teachers";
import { toast } from "sonner";

export function useTeachersData(searchQuery: string = "") {
  const queryClient = useQueryClient();
  
  // Initialize the database on first load
  useQuery({
    queryKey: ["teachersInit"],
    queryFn: async () => {
      await teacherService.initDatabase();
      return true;
    },
    staleTime: Infinity
  });
  
  // Get teachers data
  const { data: teachers = [], isLoading, error } = useQuery({
    queryKey: ["teachers", searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return teacherService.searchTeachers(searchQuery);
      }
      return teacherService.getAllTeachers();
    }
  });
  
  // Add a new teacher
  const addTeacherMutation = useMutation({
    mutationFn: (newTeacher: Omit<TeacherData, "id">) => 
      teacherService.addTeacher(newTeacher),
    onSuccess: () => {
      toast.success("Enseignant ajouté avec succès");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'enseignant");
    }
  });
  
  // Update an existing teacher
  const updateTeacherMutation = useMutation({
    mutationFn: ({ id, teacher }: { id: string; teacher: Omit<TeacherData, "id"> }) => 
      teacherService.updateTeacher(id, teacher),
    onSuccess: () => {
      toast.success("Enseignant mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'enseignant");
    }
  });
  
  // Delete a teacher
  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => 
      teacherService.deleteTeacher(id),
    onSuccess: () => {
      toast.success("Enseignant supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'enseignant");
    }
  });
  
  return {
    teachers,
    isLoading,
    error,
    addTeacher: (teacher: Omit<TeacherData, "id">) => addTeacherMutation.mutate(teacher),
    updateTeacher: (id: string, teacher: Omit<TeacherData, "id">) => 
      updateTeacherMutation.mutate({ id, teacher }),
    deleteTeacher: (id: string) => deleteTeacherMutation.mutate(id)
  };
}
