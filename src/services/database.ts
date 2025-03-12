import Dexie from 'dexie';
import { CourseData } from '@/types/courses';
import { ScheduleEvent } from '@/types/schedule';
import { StudentData } from '@/types/students';
import { TeacherData } from '@/types/teachers';
import { ClassData } from '@/types/classes';

class AppDatabase extends Dexie {
  courses: Dexie.Table<CourseData, string>;
  schedules: Dexie.Table<ScheduleEvent, string>;
  students: Dexie.Table<StudentData, string>;
  teachers: Dexie.Table<TeacherData, string>;
  classes: Dexie.Table<ClassData, string>;

  constructor() {
    super('coursesAppDB');
    
    this.version(4).stores({
      courses: 'id, name, teacherId, teacherName',
      schedules: 'id, courseId, startTime, endTime, dayOfWeek',
      students: 'id, name, class, email',
      teachers: 'id, name, subject, email',
      classes: 'id, name, level'
    });
    
    this.courses = this.table('courses');
    this.schedules = this.table('schedules');
    this.students = this.table('students');
    this.teachers = this.table('teachers');
    this.classes = this.table('classes');
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

// Service pour gérer les horaires
export const scheduleService = {
  initSchedules: async () => {
    const count = await db.schedules.count();
    
    if (count === 0) {
      const courses = await db.courses.toArray();
      const sampleSchedules = courses.map(course => ({
        id: Math.random().toString(36).substring(2, 9),
        courseId: course.id,
        courseName: course.name,
        teacherName: course.teacherName,
        startTime: course.schedule.split(' - ')[0],
        endTime: course.schedule.split(' - ')[1],
        dayOfWeek: course.schedule.split(' ')[0],
        room: `Salle ${Math.floor(Math.random() * 100) + 1}`
      }));
      
      await db.schedules.bulkAdd(sampleSchedules);
    }
  },
  
  getAllSchedules: async (): Promise<ScheduleEvent[]> => {
    return await db.schedules.toArray();
  },
  
  addSchedule: async (schedule: Omit<ScheduleEvent, 'id'>): Promise<ScheduleEvent> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newSchedule = { id, ...schedule };
    await db.schedules.add(newSchedule);
    return newSchedule;
  },
  
  updateSchedule: async (schedule: ScheduleEvent): Promise<ScheduleEvent> => {
    await db.schedules.update(schedule.id, schedule);
    return schedule;
  },
  
  deleteSchedule: async (id: string): Promise<boolean> => {
    await db.schedules.delete(id);
    return true;
  }
};

// Service pour gérer les étudiants
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

// Service pour gérer les enseignants
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

// Service pour gérer les classes
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
    const newClass = { id, ...classData };
    
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
