
import db from './database';
import { Evaluation } from '@/types/evaluations';

export const evaluationService = {
  initEvaluations: async () => {
    const count = await db.evaluations.count();
    
    if (count === 0) {
      try {
        const courses = await db.courses.toArray();
        const classes = await db.classes.toArray();
        
        if (courses.length > 0 && classes.length > 0) {
          const sampleEvaluations: Evaluation[] = courses.slice(0, 3).map((course, index) => {
            // Choisir une classe aléatoire pour l'évaluation
            const randomClass = classes[Math.floor(Math.random() * classes.length)];
            
            // Dates pour les évaluations (dans les 15 prochains jours)
            const today = new Date();
            const evalDate = new Date(today);
            evalDate.setDate(today.getDate() + (index + 1) * 3);
            
            return {
              id: Math.random().toString(36).substring(2, 9),
              title: `Évaluation ${index + 1} - ${course.name}`,
              courseId: course.id,
              courseName: course.name,
              teacherName: course.teacherName || 'Enseignant',
              classId: randomClass.id,
              className: randomClass.name,
              date: evalDate.toISOString().split('T')[0],
              startTime: '09:00',
              endTime: '10:30',
              room: `Salle ${Math.floor(Math.random() * 10) + 100}`,
              duration: 90,
              totalPoints: 20,
              status: "planned" as "planned" | "completed" | "cancelled",
              notes: "Veuillez préparer les chapitres 1 à 3"
            };
          });
          
          await db.evaluations.bulkAdd(sampleEvaluations);
          console.log("Évaluations initialisées:", sampleEvaluations.length);
        } else {
          console.warn("Pas de cours ou de classes pour initialiser les évaluations");
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation des évaluations:", error);
      }
    }
    
    return true;
  },
  
  getAllEvaluations: async (): Promise<Evaluation[]> => {
    return await db.evaluations.toArray();
  },
  
  getEvaluationsByClassId: async (classId: string): Promise<Evaluation[]> => {
    return await db.evaluations
      .filter(evaluation => evaluation.classId === classId)
      .toArray();
  },
  
  getEvaluationsByCourseId: async (courseId: string): Promise<Evaluation[]> => {
    return await db.evaluations
      .filter(evaluation => evaluation.courseId === courseId)
      .toArray();
  },
  
  addEvaluation: async (evaluation: Omit<Evaluation, 'id'>): Promise<Evaluation> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newEvaluation: Evaluation = { id, ...evaluation };
    await db.evaluations.add(newEvaluation);
    return newEvaluation;
  },
  
  updateEvaluation: async (evaluation: Evaluation): Promise<Evaluation> => {
    await db.evaluations.update(evaluation.id, evaluation);
    return evaluation;
  },
  
  deleteEvaluation: async (id: string): Promise<boolean> => {
    await db.evaluations.delete(id);
    return true;
  },
  
  clearEvaluations: async (): Promise<void> => {
    await db.evaluations.clear();
  }
};
