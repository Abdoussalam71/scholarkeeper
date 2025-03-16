
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/services/db/courseService";
import { Course } from "@/types/courses";
import { toast } from "sonner";

export function useCoursesData() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Initialiser la base de données au premier chargement
  useQuery({
    queryKey: ["coursesInit"],
    queryFn: async () => {
      await courseService.initDatabase();
      return true;
    },
    staleTime: Infinity
  });

  // Récupérer tous les cours
  const { 
    data: allCourses = [], 
    isLoading,
    error,
    refetch: refreshCourses
  } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getAllCourses()
  });

  // Filtrer les cours basés sur le terme de recherche
  const courses = searchTerm
    ? allCourses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.className && course.className.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : allCourses;

  // Ajouter un cours
  const addCourseMutation = useMutation({
    mutationFn: (course: Omit<Course, "id">) => courseService.addCourse(course),
    onSuccess: () => {
      toast({
        title: "Cours ajouté",
        description: "Le cours a été ajouté avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le cours",
        variant: "destructive",
      });
    }
  });

  // Mettre à jour un cours
  const updateCourseMutation = useMutation({
    mutationFn: ({ id, course }: { id: string, course: Partial<Course> }) => 
      courseService.updateCourse(id, course),
    onSuccess: () => {
      toast({
        title: "Cours mis à jour",
        description: "Le cours a été mis à jour avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le cours",
        variant: "destructive",
      });
    }
  });

  // Supprimer un cours
  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onSuccess: () => {
      toast({
        title: "Cours supprimé",
        description: "Le cours a été supprimé avec succès",
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive",
      });
    }
  });

  return {
    courses,
    allCourses,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    addCourse: (course: Omit<Course, "id">) => addCourseMutation.mutate(course),
    updateCourse: (id: string, course: Partial<Course>) => 
      updateCourseMutation.mutate({ id, course }),
    deleteCourse: (id: string) => deleteCourseMutation.mutate(id),
    refreshCourses
  };
}
