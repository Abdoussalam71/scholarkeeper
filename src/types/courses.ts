
export interface Course {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  classId?: string;
  className?: string;
  schedule: string;
  duration: string;
  maxStudents: number;
  currentStudents: number;
  academicYear: string;
  syllabus?: string;
  materials?: CourseMaterial[];
  status: 'active' | 'inactive' | 'completed';
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'document' | 'video' | 'link' | 'other';
  url?: string;
  description?: string;
  uploadDate: string;
}

export interface CourseSession {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  description?: string;
  attendance?: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}
