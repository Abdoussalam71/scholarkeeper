
// This file re-exports all database services from their individual files
import { courseService } from './db/courseService';
import { scheduleService } from './db/scheduleService';
import { studentService } from './db/studentService';
import { teacherService } from './db/teacherService';
import { classService } from './db/classService';
import { evaluationService } from './db/evaluationService';

// Re-export all services
export {
  courseService,
  scheduleService,
  studentService,
  teacherService,
  classService,
  evaluationService
};
