
import db from './database';
import { ScheduleEvent } from '@/types/schedule';

export const scheduleService = {
  initSchedules: async () => {
    const count = await db.schedules.count();
    
    if (count === 0) {
      const courses = await db.courses.toArray();
      const sampleSchedules = courses.map(course => ({
        id: Math.random().toString(36).substring(2, 9),
        courseId: course.id,
        courseName: course.name,
        teacherName: course.teacherName,
        startTime: course.schedule.split(' - ')[0],
        endTime: course.schedule.split(' - ')[1],
        dayOfWeek: course.schedule.split(' ')[0],
        room: `Salle ${Math.floor(Math.random() * 100) + 1}`
      }));
      
      await db.schedules.bulkAdd(sampleSchedules);
    }
  },
  
  getAllSchedules: async (): Promise<ScheduleEvent[]> => {
    return await db.schedules.toArray();
  },
  
  addSchedule: async (schedule: Omit<ScheduleEvent, 'id'>): Promise<ScheduleEvent> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newSchedule = { id, ...schedule };
    await db.schedules.add(newSchedule);
    return newSchedule;
  },
  
  updateSchedule: async (schedule: ScheduleEvent): Promise<ScheduleEvent> => {
    await db.schedules.update(schedule.id, schedule);
    return schedule;
  },
  
  deleteSchedule: async (id: string): Promise<boolean> => {
    await db.schedules.delete(id);
    return true;
  }
};
