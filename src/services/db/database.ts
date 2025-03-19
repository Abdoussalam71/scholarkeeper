
import Dexie, { Table } from 'dexie';
import { StudentData } from '@/types/students';
import { TeacherData } from '@/types/teachers';
import { CourseData } from '@/types/courses';
import { ClassData } from '@/types/classes';
import { ScheduleEvent } from '@/types/schedule';
import { PaymentData } from '@/types/payments';
import { Evaluation } from '@/types/evaluations';

class SchoolDatabase extends Dexie {
  students!: Table<StudentData, string>;
  teachers!: Table<TeacherData, string>;
  courses!: Table<CourseData, string>;
  classes!: Table<ClassData, string>;
  scheduleEvents!: Table<ScheduleEvent, string>;
  payments!: Table<PaymentData, string>;
  evaluations!: Table<Evaluation, string>;

  constructor() {
    super('schoolDatabase');
    this.version(6).stores({
      students: 'id, name, email, phone, address, status',
      teachers: 'id, name, email, phone, address, status',
      courses: 'id, name, description, teacherId',
      classes: 'id, name, level, academicYear',
      scheduleEvents: 'id, courseId, classId, day, startTime, endTime',
      payments: 'id, studentId, amount, paymentDate, paymentType, description',
      evaluations: 'id, title, courseId, classId, date, startTime, endTime'
    });
  }
}

const db = new SchoolDatabase();

export default db;
