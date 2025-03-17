
import db from './database';
import { Evaluation } from '@/types/evaluations';

export const evaluationService = {
  initEvaluations: async () => {
    const count = await db.evaluations.count();
    
    if (count === 0) {
      const courses = await db.courses.toArray();
      const classes = await db.classes.toArray();
      
      // Créer quelques évaluations d'exemple
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
            teacherName: course.teacherName,
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
      }
    }
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
    const newEvaluation = { id, ...evaluation };
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
  
  // Méthode pour nettoyer la base de données en supprimant toutes les évaluations
  clearEvaluations: async (): Promise<void> => {
    await db.evaluations.clear();
  }
};
