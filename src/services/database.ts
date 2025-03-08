
import Dexie from 'dexie';
import { CourseData } from '@/types/courses';

class AppDatabase extends Dexie {
  courses: Dexie.Table<CourseData, string>;

  constructor() {
    super('coursesAppDB');
    
    this.version(1).stores({
      courses: 'id, name, teacherId, teacherName'
    });
    
    this.courses = this.table('courses');
  }
}

const db = new AppDatabase();

// Service pour gérer les cours
export const courseService = {
  initDatabase: async () => {
    const count = await db.courses.count();
    
    // Si pas de données, insérer des exemples
    if (count === 0) {
      const sampleCourses = [
        {
          id: "1",
          name: "Mathématiques Avancées",
          description: "Cours de mathématiques pour niveau avancé",
          teacherId: "1",
          teacherName: "Jean Dupont",
          schedule: "Lundi 10:00 - 12:00",
          duration: "2 heures",
          maxStudents: 25,
          currentStudents: 18
        },
        {
          id: "2",
          name: "Physique Fondamentale",
          description: "Introduction aux concepts de base de la physique",
          teacherId: "2",
          teacherName: "Marie Lambert",
          schedule: "Mardi 14:00 - 16:00",
          duration: "2 heures",
          maxStudents: 30,
          currentStudents: 22
        },
        {
          id: "3",
          name: "Littérature Française",
          description: "Étude des grands auteurs français",
          teacherId: "3",
          teacherName: "Sophie Martin",
          schedule: "Mercredi 9:00 - 11:00",
          duration: "2 heures",
          maxStudents: 20,
          currentStudents: 15
        },
        {
          id: "4",
          name: "Anglais Intermédiaire",
          description: "Perfectionnement en anglais pour niveau intermédiaire",
          teacherId: "4",
          teacherName: "Pierre Leclerc",
          schedule: "Jeudi 13:00 - 15:00",
          duration: "2 heures",
          maxStudents: 15,
          currentStudents: 12
        },
        {
          id: "5",
          name: "Programmation Informatique",
          description: "Introduction à la programmation et algorithmes",
          teacherId: "5",
          teacherName: "Thomas Petit",
          schedule: "Vendredi 10:00 - 13:00",
          duration: "3 heures",
          maxStudents: 20,
          currentStudents: 19
        }
      ];
      
      await db.courses.bulkAdd(sampleCourses);
    }
  },
  
  getAllCourses: async (): Promise<CourseData[]> => {
    return await db.courses.toArray();
  },
  
  searchCourses: async (searchTerm: string): Promise<CourseData[]> => {
    searchTerm = searchTerm.toLowerCase();
    return await db.courses
      .filter(course => 
        course.name.toLowerCase().includes(searchTerm) || 
        course.teacherName.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm)
      )
      .toArray();
  },
  
  getCourseById: async (id: string): Promise<CourseData | undefined> => {
    return await db.courses.get(id);
  },
  
  addCourse: async (course: Omit<CourseData, 'id'>): Promise<CourseData> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newCourse = { id, ...course };
    
    await db.courses.add(newCourse);
    return newCourse;
  },
  
  updateCourse: async (course: CourseData): Promise<CourseData> => {
    await db.courses.update(course.id, course);
    return course;
  },
  
  deleteCourse: async (id: string): Promise<boolean> => {
    await db.courses.delete(id);
    return true;
  }
};
