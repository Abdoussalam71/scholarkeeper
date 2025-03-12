
import db from './database';
import { StudentData } from '@/types/students';
import { classService } from './classService';

export const studentService = {
  initDatabase: async () => {
    const count = await db.students.count();
    
    if (count === 0) {
      const sampleStudents = [
        { id: "1", name: "Antoine Dupont", age: 16, class: "Seconde B", email: "antoine@example.com", attendance: 92 },
        { id: "2", name: "Emma Martin", age: 17, class: "Première A", email: "emma@example.com", attendance: 88 },
        { id: "3", name: "Lucas Bernard", age: 15, class: "Troisième C", email: "lucas@example.com", attendance: 95 },
        { id: "4", name: "Léa Petit", age: 18, class: "Terminale S", email: "lea@example.com", attendance: 98 },
        { id: "5", name: "Thomas Dubois", age: 16, class: "Seconde A", email: "thomas@example.com", attendance: 85 },
      ];
      
      await db.students.bulkAdd(sampleStudents);
    }
  },
  
  getAllStudents: async (): Promise<StudentData[]> => {
    return await db.students.toArray();
  },
  
  searchStudents: async (searchTerm: string): Promise<StudentData[]> => {
    searchTerm = searchTerm.toLowerCase();
    return await db.students
      .filter(student => 
        student.name.toLowerCase().includes(searchTerm) || 
        student.class.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm)
      )
      .toArray();
  },
  
  getStudentById: async (id: string): Promise<StudentData | undefined> => {
    return await db.students.get(id);
  },
  
  addStudent: async (student: Omit<StudentData, 'id'>): Promise<StudentData> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newStudent = { id, ...student };
    
    await db.students.add(newStudent);
    
    // Si l'étudiant est assigné à une classe, mettre à jour la classe
    if (student.class) {
      const classObj = await classService.getClassByName(student.class);
      if (classObj) {
        const updatedStudents = [...classObj.students, id];
        await classService.updateClass({
          ...classObj,
          students: updatedStudents
        });
      }
    }
    
    return newStudent;
  },
  
  updateStudent: async (id: string, student: Omit<StudentData, 'id'>): Promise<StudentData> => {
    const existingStudent = await db.students.get(id);
    
    // Si la classe a changé, mettre à jour les deux classes concernées
    if (existingStudent && existingStudent.class !== student.class) {
      // Retirer l'étudiant de l'ancienne classe
      if (existingStudent.class) {
        const oldClass = await classService.getClassByName(existingStudent.class);
        if (oldClass) {
          const updatedStudents = oldClass.students.filter(sid => sid !== id);
          await classService.updateClass({
            ...oldClass,
            students: updatedStudents
          });
        }
      }
      
      // Ajouter l'étudiant à la nouvelle classe
      if (student.class) {
        const newClass = await classService.getClassByName(student.class);
        if (newClass) {
          const updatedStudents = [...newClass.students, id];
          await classService.updateClass({
            ...newClass,
            students: updatedStudents
          });
        }
      }
    }
    
    const updatedStudent = { id, ...student };
    await db.students.update(id, student);
    return updatedStudent;
  },
  
  deleteStudent: async (id: string): Promise<boolean> => {
    const student = await db.students.get(id);
    
    // Retirer l'étudiant de sa classe
    if (student && student.class) {
      const classObj = await classService.getClassByName(student.class);
      if (classObj) {
        const updatedStudents = classObj.students.filter(sid => sid !== id);
        await classService.updateClass({
          ...classObj,
          students: updatedStudents
        });
      }
    }
    
    await db.students.delete(id);
    return true;
  }
};
