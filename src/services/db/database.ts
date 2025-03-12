
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

// Create and export a single instance of the database
const db = new AppDatabase();
export default db;
