
import Database from 'better-sqlite3';
import { CourseData } from '@/types/courses';

// Initialiser la base de données
const db = new Database(':memory:'); // Base de données en mémoire pour l'exemple

// Créer les tables nécessaires
const initDatabase = () => {
  // Créer la table des cours
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      teacherId TEXT NOT NULL,
      teacherName TEXT NOT NULL,
      schedule TEXT,
      duration TEXT,
      maxStudents INTEGER,
      currentStudents INTEGER
    )
  `);
  
  // Vérifier si nous avons des données
  const count = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
  
  // Si pas de données, insérer des exemples
  if (count.count === 0) {
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
    
    const insert = db.prepare(`
      INSERT INTO courses (id, name, description, teacherId, teacherName, schedule, duration, maxStudents, currentStudents)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    for (const course of sampleCourses) {
      insert.run(
        course.id,
        course.name,
        course.description,
        course.teacherId,
        course.teacherName,
        course.schedule,
        course.duration,
        course.maxStudents,
        course.currentStudents
      );
    }
  }
};

// Fonctions pour gérer les cours
export const courseService = {
  initDatabase,
  
  getAllCourses: (): CourseData[] => {
    const courses = db.prepare('SELECT * FROM courses').all() as CourseData[];
    return courses;
  },
  
  searchCourses: (searchTerm: string): CourseData[] => {
    return db.prepare(`
      SELECT * FROM courses 
      WHERE name LIKE ? OR teacherName LIKE ? OR description LIKE ?
    `).all(
      `%${searchTerm}%`, 
      `%${searchTerm}%`, 
      `%${searchTerm}%`
    ) as CourseData[];
  },
  
  getCourseById: (id: string): CourseData | undefined => {
    return db.prepare('SELECT * FROM courses WHERE id = ?').get(id) as CourseData | undefined;
  },
  
  addCourse: (course: Omit<CourseData, 'id'>): CourseData => {
    const id = Math.random().toString(36).substring(2, 9);
    const newCourse = { id, ...course };
    
    db.prepare(`
      INSERT INTO courses (id, name, description, teacherId, teacherName, schedule, duration, maxStudents, currentStudents)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newCourse.id,
      newCourse.name,
      newCourse.description,
      newCourse.teacherId,
      newCourse.teacherName,
      newCourse.schedule,
      newCourse.duration,
      newCourse.maxStudents,
      newCourse.currentStudents
    );
    
    return newCourse;
  },
  
  updateCourse: (course: CourseData): CourseData => {
    db.prepare(`
      UPDATE courses
      SET name = ?, description = ?, teacherId = ?, teacherName = ?, 
          schedule = ?, duration = ?, maxStudents = ?, currentStudents = ?
      WHERE id = ?
    `).run(
      course.name,
      course.description,
      course.teacherId,
      course.teacherName,
      course.schedule,
      course.duration,
      course.maxStudents,
      course.currentStudents,
      course.id
    );
    
    return course;
  },
  
  deleteCourse: (id: string): boolean => {
    const result = db.prepare('DELETE FROM courses WHERE id = ?').run(id);
    return result.changes > 0;
  }
};
