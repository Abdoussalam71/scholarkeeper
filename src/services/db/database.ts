
import Dexie from 'dexie';
import { CourseData } from '@/types/courses';
import { ScheduleEvent } from '@/types/schedule';
import { StudentData } from '@/types/students';
import { TeacherData } from '@/types/teachers';
import { ClassData } from '@/types/classes';
import { ClassFees, PaymentPlan, PaymentReceipt } from '@/types/fees';

class AppDatabase extends Dexie {
  courses: Dexie.Table<CourseData, string>;
  schedules: Dexie.Table<ScheduleEvent, string>;
  students: Dexie.Table<StudentData, string>;
  teachers: Dexie.Table<TeacherData, string>;
  classes: Dexie.Table<ClassData, string>;
  classFees: Dexie.Table<ClassFees, string>;
  paymentPlans: Dexie.Table<PaymentPlan, string>;
  receipts: Dexie.Table<PaymentReceipt, string>;

  constructor() {
    super('coursesAppDB');
    
    this.version(5).stores({
      courses: 'id, name, teacherId, teacherName',
      schedules: 'id, courseId, startTime, endTime, dayOfWeek',
      students: 'id, name, class, email',
      teachers: 'id, name, subject, email',
      classes: 'id, name, level',
      classFees: 'id, classId, className, academicYear',
      paymentPlans: 'id, name, instalments',
      receipts: 'id, transactionId, studentId, receiptNumber'
    });
    
    this.courses = this.table('courses');
    this.schedules = this.table('schedules');
    this.students = this.table('students');
    this.teachers = this.table('teachers');
    this.classes = this.table('classes');
    this.classFees = this.table('classFees');
    this.paymentPlans = this.table('paymentPlans');
    this.receipts = this.table('receipts');
  }
}

// Create and export a single instance of the database
const db = new AppDatabase();
export default db;
