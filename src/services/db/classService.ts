
import db from './database';
import { ClassData } from '@/types/classes';

export const classService = {
  initDatabase: async () => {
    const count = await db.classes.count();
    
    if (count === 0) {
      const sampleClasses = [
        { id: "1", name: "Seconde A", level: "Lycée" as const, description: "Classe de seconde générale", students: [] },
        { id: "2", name: "Première S", level: "Lycée" as const, description: "Classe de première scientifique", students: [] },
        { id: "3", name: "Terminale ES", level: "Lycée" as const, description: "Classe de terminale économique et sociale", students: [] },
        { id: "4", name: "BTS Informatique", level: "Supérieur" as const, description: "BTS Services informatiques aux organisations", students: [] },
        { id: "5", name: "3ème B", level: "Collège" as const, description: "Classe de troisième", students: [] },
      ];
      
      await db.classes.bulkAdd(sampleClasses);
    }
  },
  
  getAllClasses: async (): Promise<ClassData[]> => {
    return await db.classes.toArray();
  },
  
  getClassesByLevel: async (level: string): Promise<ClassData[]> => {
    return await db.classes
      .filter(cls => cls.level === level)
      .toArray();
  },
  
  searchClasses: async (searchTerm: string): Promise<ClassData[]> => {
    searchTerm = searchTerm.toLowerCase();
    return await db.classes
      .filter(cls => 
        cls.name.toLowerCase().includes(searchTerm) || 
        cls.level.toLowerCase().includes(searchTerm) ||
        (cls.description && cls.description.toLowerCase().includes(searchTerm))
      )
      .toArray();
  },
  
  getClassById: async (id: string): Promise<ClassData | undefined> => {
    return await db.classes.get(id);
  },
  
  getClassByName: async (name: string): Promise<ClassData | undefined> => {
    return await db.classes
      .filter(cls => cls.name === name)
      .first();
  },
  
  addClass: async (classData: Omit<ClassData, 'id'>): Promise<ClassData> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newClass = { id, ...classData, students: classData.students || [] };
    
    await db.classes.add(newClass);
    return newClass;
  },
  
  updateClass: async (classData: ClassData): Promise<ClassData> => {
    await db.classes.update(classData.id, classData);
    return classData;
  },
  
  deleteClass: async (id: string): Promise<boolean> => {
    // Mettre à jour tous les étudiants de cette classe
    const classObj = await db.classes.get(id);
    if (classObj) {
      for (const studentId of classObj.students) {
        const student = await db.students.get(studentId);
        if (student && student.class === classObj.name) {
          await db.students.update(studentId, { ...student, class: "" });
        }
      }
    }
    
    await db.classes.delete(id);
    return true;
  }
};
