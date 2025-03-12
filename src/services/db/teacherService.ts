
import db from './database';
import { TeacherData } from '@/types/teachers';

export const teacherService = {
  initDatabase: async () => {
    const count = await db.teachers.count();
    
    if (count === 0) {
      const sampleTeachers = [
        { id: "1", name: "Marie Dubois", subject: "Mathématiques", email: "marie.dubois@example.com", phone: "06 12 34 56 78", availability: "Lundi, Mardi, Jeudi", hireDate: "01/09/2019" },
        { id: "2", name: "Pierre Martin", subject: "Physique-Chimie", email: "pierre.martin@example.com", phone: "06 23 45 67 89", availability: "Mardi, Mercredi, Vendredi", hireDate: "15/09/2020" },
        { id: "3", name: "Sophie Laurent", subject: "Français", email: "sophie.laurent@example.com", phone: "06 34 56 78 90", availability: "Lundi, Jeudi, Vendredi", hireDate: "01/09/2018" },
        { id: "4", name: "Jean Lefebvre", subject: "Histoire-Géographie", email: "jean.lefebvre@example.com", phone: "06 45 67 89 01", availability: "Mercredi, Jeudi, Vendredi", hireDate: "01/09/2021" },
        { id: "5", name: "Camille Bernard", subject: "Anglais", email: "camille.bernard@example.com", phone: "06 56 78 90 12", availability: "Lundi, Mardi, Mercredi", hireDate: "01/09/2017" },
      ];
      
      await db.teachers.bulkAdd(sampleTeachers);
    }
  },
  
  getAllTeachers: async (): Promise<TeacherData[]> => {
    return await db.teachers.toArray();
  },
  
  searchTeachers: async (searchTerm: string): Promise<TeacherData[]> => {
    searchTerm = searchTerm.toLowerCase();
    return await db.teachers
      .filter(teacher => 
        teacher.name.toLowerCase().includes(searchTerm) || 
        teacher.subject.toLowerCase().includes(searchTerm) ||
        teacher.email.toLowerCase().includes(searchTerm)
      )
      .toArray();
  },
  
  getTeacherById: async (id: string): Promise<TeacherData | undefined> => {
    return await db.teachers.get(id);
  },
  
  addTeacher: async (teacher: Omit<TeacherData, 'id'>): Promise<TeacherData> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newTeacher = { id, ...teacher };
    
    await db.teachers.add(newTeacher);
    return newTeacher;
  },
  
  updateTeacher: async (id: string, teacher: Omit<TeacherData, 'id'>): Promise<TeacherData> => {
    const updatedTeacher = { id, ...teacher };
    await db.teachers.update(id, teacher);
    return updatedTeacher;
  },
  
  deleteTeacher: async (id: string): Promise<boolean> => {
    await db.teachers.delete(id);
    return true;
  }
};
