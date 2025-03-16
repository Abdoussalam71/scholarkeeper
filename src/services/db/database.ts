
import Dexie from 'dexie';
import { ClassData } from '@/types/classes';
import { StudentData } from '@/types/students';
import { TeacherData } from '@/types/teachers';
import { ScheduleEvent } from '@/types/schedule';
import { Course, CourseMaterial, CourseSession } from '@/types/courses';

// Define a custom Dexie class with typed tables
class SchoolDatabase extends Dexie {
  teachers!: Dexie.Table<TeacherData, string>;
  classes!: Dexie.Table<ClassData, string>;
  students!: Dexie.Table<StudentData, string>;
  subjects!: Dexie.Table<any, string>;
  scheduleEvents!: Dexie.Table<ScheduleEvent, string>;
  schedules!: Dexie.Table<ScheduleEvent, string>;
  paymentPlans!: Dexie.Table<any, string>;
  classFees!: Dexie.Table<any, string>;
  receipts!: Dexie.Table<any, string>;
  courses!: Dexie.Table<Course, string>;
  courseSessions!: Dexie.Table<CourseSession, string>;
  courseMaterials!: Dexie.Table<CourseMaterial, string>;
  schoolInfo!: Dexie.Table<any, string>;

  constructor() {
    super('school_management_db');
    this.version(1).stores({
      teachers: 'id, name, email',
      classes: 'id, name',
      students: 'id, name, class',
      subjects: 'id, name',
      scheduleEvents: 'id, title, start, end',
      schedules: 'id, courseId, classId',
      paymentPlans: 'id, name',
      classFees: 'id, classId, className',
      receipts: 'id, studentId, receiptNumber, transactionId',
      courses: 'id, name, teacherId, className',
      courseSessions: 'id, courseId',
      courseMaterials: 'id, courseId',
      schoolInfo: 'id'
    });
  }
}

const db = new SchoolDatabase();

export default db;
