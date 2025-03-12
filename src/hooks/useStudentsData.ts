
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/database";
import { StudentData } from "@/types/students";
import { toast } from "sonner";

export function useStudentsData(searchQuery: string = "") {
  const queryClient = useQueryClient();
  
  // Initialize the database on first load
  useQuery({
    queryKey: ["studentsInit"],
    queryFn: async () => {
      await studentService.initDatabase();
      return true;
    },
    staleTime: Infinity
  });
  
  // Get students data
  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ["students", searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return studentService.searchStudents(searchQuery);
      }
      return studentService.getAllStudents();
    }
  });
  
  // Add a new student
  const addStudentMutation = useMutation({
    mutationFn: (newStudent: Omit<StudentData, "id">) => 
      studentService.addStudent(newStudent),
    onSuccess: () => {
      toast.success("Étudiant ajouté avec succès");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'étudiant");
    }
  });
  
  // Update an existing student
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, student }: { id: string; student: Omit<StudentData, "id"> }) => 
      studentService.updateStudent(id, student),
    onSuccess: () => {
      toast.success("Étudiant mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'étudiant");
    }
  });
  
  // Delete a student
  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => 
      studentService.deleteStudent(id),
    onSuccess: () => {
      toast.success("Étudiant supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'étudiant");
    }
  });
  
  return {
    students,
    isLoading,
    error,
    addStudent: (student: Omit<StudentData, "id">) => addStudentMutation.mutate(student),
    updateStudent: (id: string, student: Omit<StudentData, "id">) => 
      updateStudentMutation.mutate({ id, student }),
    deleteStudent: (id: string) => deleteStudentMutation.mutate(id)
  };
}
