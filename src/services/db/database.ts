
import Dexie from 'dexie';

const db = new Dexie('school_management_db');

db.version(1).stores({
  teachers: 'id, name, email',
  classes: 'id, name',
  students: 'id, name, class',
  subjects: 'id, name',
  scheduleEvents: 'id, title, start, end',
  paymentPlans: 'id, name',
  classFees: 'id, classId, className',
  receipts: 'id, studentId, receiptNumber, transactionId',
  courses: 'id, name, teacherId, className',
  courseSessions: 'id, courseId',
  courseMaterials: 'id, courseId',
  schoolInfo: 'id'
});

export default db;
