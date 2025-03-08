
import { useState, useEffect } from 'react';
import { courseService } from '@/services/database';
import { CourseData } from '@/types/courses';
import { toast } from '@/components/ui/use-toast';

export const useCoursesData = (initialSearchTerm: string = '') => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  // Initialiser la base de données au démarrage
  useEffect(() => {
    const initDb = async () => {
      try {
        // Initialiser la base de données
        await courseService.initDatabase();
        loadCourses();
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        toast({
          title: "Erreur de base de données",
          description: "Impossible de charger la base de données",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    initDb();
  }, []);
  
  // Charger les cours en fonction du terme de recherche
  useEffect(() => {
    loadCourses();
  }, [searchTerm]);
  
  const loadCourses = async () => {
    setIsLoading(true);
    try {
      let loadedCourses;
      if (searchTerm) {
        loadedCourses = await courseService.searchCourses(searchTerm);
      } else {
        loadedCourses = await courseService.getAllCourses();
      }
      setCourses(loadedCourses);
    } catch (error) {
      console.error('Erreur lors du chargement des cours:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cours",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addCourse = async (course: Omit<CourseData, 'id'>) => {
    try {
      const newCourse = await courseService.addCourse(course);
      setCourses(prevCourses => [...prevCourses, newCourse]);
      toast({
        title: "Succès",
        description: "Cours ajouté avec succès",
      });
      return newCourse;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du cours:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le cours",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const updateCourse = async (course: CourseData) => {
    try {
      const updatedCourse = await courseService.updateCourse(course);
      setCourses(prevCourses => 
        prevCourses.map(c => c.id === course.id ? updatedCourse : c)
      );
      toast({
        title: "Succès",
        description: "Cours mis à jour avec succès",
      });
      return updatedCourse;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du cours:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le cours",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  const deleteCourse = async (id: string) => {
    try {
      const success = await courseService.deleteCourse(id);
      if (success) {
        setCourses(prevCourses => prevCourses.filter(c => c.id !== id));
        toast({
          title: "Succès",
          description: "Cours supprimé avec succès",
        });
      }
      return success;
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le cours",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    courses,
    isLoading,
    searchTerm,
    setSearchTerm,
    addCourse,
    updateCourse,
    deleteCourse,
    refreshCourses: loadCourses
  };
};
