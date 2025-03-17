
export interface Evaluation {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  classId: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  duration: number; // Durée en minutes
  totalPoints: number;
  status: "planned" | "completed" | "cancelled";
  notes?: string;
}
