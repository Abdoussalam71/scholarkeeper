
import Dexie, { Table } from 'dexie';
import { StudentData } from '@/types/students';
import { TeacherData } from '@/types/teachers';
import { Course } from '@/types/courses';
import { ClassData } from '@/types/classes';
import { ScheduleEvent } from '@/types/schedule';

// Définition du type PaymentData car il n'existe pas encore
interface PaymentData {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  paymentType: string;
  description: string;
}

class SchoolDatabase extends Dexie {
  students!: Table<StudentData, string>;
  teachers!: Table<TeacherData, string>;
  courses!: Table<Course, string>;
  classes!: Table<ClassData, string>;
  scheduleEvents!: Table<ScheduleEvent, string>;
  payments!: Table<PaymentData, string>;

  constructor() {
    super('schoolDatabase');
    this.version(7).stores({
      students: 'id, name, email, phone, address, status',
      teachers: 'id, name, email, phone, address, status',
      courses: 'id, name, description, teacherId',
      classes: 'id, name, level, academicYear',
      scheduleEvents: 'id, courseId, classId, day, startTime, endTime',
      payments: 'id, studentId, amount, paymentDate, paymentType, description'
    });
  }
}

const db = new SchoolDatabase();

export default db;
