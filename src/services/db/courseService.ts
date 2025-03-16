
import db from './database';
import { Course, CourseSession, CourseMaterial } from '@/types/courses';

export const courseService = {
  initDatabase: async () => {
    const count = await db.table('courses').count();
    
    if (count === 0) {
      const sampleCourses: Course[] = [
        {
          id: "1",
          name: "Mathématiques",
          description: "Cours de mathématiques avancées",
          teacherId: "1",
          teacherName: "Prof. Martin",
          className: "Terminale S",
          schedule: "Lundi et Mercredi, 10:00-12:00",
          duration: "2h",
          maxStudents: 30,
          currentStudents: 22,
          academicYear: "2023-2024",
          status: "active"
        },
        {
          id: "2",
          name: "Physique-Chimie",
          description: "Cours de physique et chimie",
          teacherId: "2",
          teacherName: "Dr. Dupont",
          className: "Première S",
          schedule: "Mardi et Jeudi, 14:00-16:00",
          duration: "2h",
          maxStudents: 25,
          currentStudents: 20,
          academicYear: "2023-2024",
          status: "active"
        },
        {
          id: "3",
          name: "Histoire-Géographie",
          description: "Cours d'histoire et géographie",
          teacherId: "3",
          teacherName: "Mme. Lambert",
          className: "Seconde A",
          schedule: "Vendredi, 08:00-10:00",
          duration: "2h",
          maxStudents: 28,
          currentStudents: 25,
          academicYear: "2023-2024",
          status: "active"
        }
      ];
      
      await db.table('courses').bulkAdd(sampleCourses);
    }
  },
  
  getAllCourses: async (): Promise<Course[]> => {
    return await db.table('courses').toArray();
  },
  
  getCourseById: async (id: string): Promise<Course | undefined> => {
    return await db.table('courses').get(id);
  },
  
  searchCourses: async (searchTerm: string): Promise<Course[]> => {
    searchTerm = searchTerm.toLowerCase();
    return await db.table('courses')
      .filter(course => 
        course.name.toLowerCase().includes(searchTerm) || 
        course.description.toLowerCase().includes(searchTerm) ||
        course.teacherName.toLowerCase().includes(searchTerm) ||
        (course.className && course.className.toLowerCase().includes(searchTerm))
      )
      .toArray();
  },
  
  addCourse: async (course: Omit<Course, "id">): Promise<Course> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newCourse = { id, ...course };
    
    await db.table('courses').add(newCourse);
    return newCourse;
  },
  
  updateCourse: async (id: string, course: Partial<Course>): Promise<Course | undefined> => {
    await db.table('courses').update(id, course);
    return await db.table('courses').get(id);
  },
  
  deleteCourse: async (id: string): Promise<boolean> => {
    await db.table('courses').delete(id);
    
    // Supprimer également les sessions et matériaux associés
    await db.table('courseSessions').where({ courseId: id }).delete();
    await db.table('courseMaterials').where({ courseId: id }).delete();
    
    return true;
  },
  
  getCoursesByTeacherId: async (teacherId: string): Promise<Course[]> => {
    return await db.table('courses')
      .where({ teacherId })
      .toArray();
  },
  
  getCoursesByClassName: async (className: string): Promise<Course[]> => {
    return await db.table('courses')
      .where({ className })
      .toArray();
  },
  
  // Gestion des sessions de cours
  
  getCourseSessionsByCourseId: async (courseId: string): Promise<CourseSession[]> => {
    return await db.table('courseSessions')
      .where({ courseId })
      .toArray();
  },
  
  addCourseSession: async (session: Omit<CourseSession, "id">): Promise<CourseSession> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newSession = { id, ...session };
    
    await db.table('courseSessions').add(newSession);
    return newSession;
  },
  
  // Gestion des matériaux de cours
  
  getCourseMaterialsByCourseId: async (courseId: string): Promise<CourseMaterial[]> => {
    return await db.table('courseMaterials')
      .where({ courseId })
      .toArray();
  },
  
  addCourseMaterial: async (material: Omit<CourseMaterial & { courseId: string }, "id">): Promise<CourseMaterial> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newMaterial = { id, ...material };
    
    await db.table('courseMaterials').add(newMaterial);
    return newMaterial;
  }
};
