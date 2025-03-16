
import db from './database';
import { Course } from '@/types/courses';

export const courseService = {
  initDatabase: async () => {
    const count = await db.courses.count();
    
    if (count === 0) {
      const teachers = await db.teachers.toArray();
      const classes = await db.classes.toArray();
      
      if (teachers.length && classes.length) {
        const sampleCourses = [
          {
            id: "1",
            name: "Mathématiques Avancées",
            description: "Cours de mathématiques pour les élèves avancés",
            teacherId: teachers[0]?.id || "1",
            teacherName: teachers[0]?.name || "Marie Dubois",
            classId: classes[0]?.id,
            className: classes[0]?.name,
            schedule: "Lundi et Mercredi, 10:00-12:00",
            duration: "2h",
            maxStudents: 30,
            currentStudents: 22,
            academicYear: "2023-2024",
            status: 'active' as const
          },
          {
            id: "2",
            name: "Physique-Chimie",
            description: "Introduction aux principes fondamentaux de la physique et chimie",
            teacherId: teachers[1]?.id || "2",
            teacherName: teachers[1]?.name || "Pierre Martin",
            classId: classes[1]?.id,
            className: classes[1]?.name,
            schedule: "Mardi et Jeudi, 14:00-16:00",
            duration: "2h",
            maxStudents: 25,
            currentStudents: 18,
            academicYear: "2023-2024",
            status: 'active' as const
          },
          {
            id: "3",
            name: "Français - Littérature",
            description: "Étude des œuvres classiques et contemporaines",
            teacherId: teachers[2]?.id || "3",
            teacherName: teachers[2]?.name || "Sophie Laurent",
            classId: classes[2]?.id,
            className: classes[2]?.name,
            schedule: "Lundi et Vendredi, 9:00-11:00",
            duration: "2h",
            maxStudents: 28,
            currentStudents: 25,
            academicYear: "2023-2024",
            status: 'active' as const
          }
        ];
        
        await db.courses.bulkAdd(sampleCourses);
      }
    }
  },
  
  getAllCourses: async (): Promise<Course[]> => {
    return await db.courses.toArray();
  },
  
  getCourseById: async (id: string): Promise<Course | undefined> => {
    return await db.courses.get(id);
  },
  
  getCoursesByTeacher: async (teacherId: string): Promise<Course[]> => {
    return await db.courses
      .filter(course => course.teacherId === teacherId)
      .toArray();
  },
  
  getCoursesByClass: async (classId: string): Promise<Course[]> => {
    return await db.courses
      .filter(course => course.classId === classId)
      .toArray();
  },
  
  addCourse: async (course: Omit<Course, "id">): Promise<Course> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newCourse = { id, ...course };
    
    await db.courses.add(newCourse);
    return newCourse;
  },
  
  updateCourse: async (id: string, course: Partial<Course>): Promise<Course> => {
    await db.courses.update(id, course);
    const updatedCourse = await db.courses.get(id);
    
    if (!updatedCourse) {
      throw new Error("Course not found after update");
    }
    
    return updatedCourse;
  },
  
  deleteCourse: async (id: string): Promise<boolean> => {
    await db.courses.delete(id);
    return true;
  }
};
