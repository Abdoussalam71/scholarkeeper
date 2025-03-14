
export interface ScheduleEvent {
  id: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  room: string;
  classId?: string; // ID de la classe associée
}
