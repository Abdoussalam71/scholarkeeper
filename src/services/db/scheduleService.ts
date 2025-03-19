
import db from './database';
import { ScheduleEvent } from '@/types/schedule';

export const scheduleService = {
  initSchedules: async () => {
    const count = await db.scheduleEvents.count();
    
    if (count === 0) {
      const courses = await db.courses.toArray();
      const classes = await db.classes.toArray();
      
      const sampleSchedules = courses.flatMap(course => {
        // Attribuer aléatoirement à une classe
        const randomClass = classes[Math.floor(Math.random() * classes.length)];
        
        return {
          id: Math.random().toString(36).substring(2, 9),
          courseId: course.id,
          courseName: course.name,
          teacherName: course.teacherName,
          startTime: course.schedule?.split(' - ')[0] || '09:00',
          endTime: course.schedule?.split(' - ')[1] || '10:30',
          dayOfWeek: course.schedule?.split(' ')[0] || 'Lundi',
          room: `Salle ${Math.floor(Math.random() * 100) + 1}`,
          classId: randomClass ? randomClass.id : undefined
        };
      });
      
      await db.scheduleEvents.bulkAdd(sampleSchedules);
    }
  },
  
  getAllSchedules: async (): Promise<ScheduleEvent[]> => {
    return await db.scheduleEvents.toArray();
  },
  
  getScheduleByClassId: async (classId: string): Promise<ScheduleEvent[]> => {
    return await db.scheduleEvents
      .filter(schedule => schedule.classId === classId)
      .toArray();
  },
  
  addSchedule: async (schedule: Omit<ScheduleEvent, 'id'>): Promise<ScheduleEvent> => {
    const id = Math.random().toString(36).substring(2, 9);
    const newSchedule = { id, ...schedule };
    await db.scheduleEvents.add(newSchedule);
    return newSchedule;
  },
  
  updateSchedule: async (schedule: ScheduleEvent): Promise<ScheduleEvent> => {
    await db.scheduleEvents.update(schedule.id, schedule);
    return schedule;
  },
  
  deleteSchedule: async (id: string): Promise<boolean> => {
    await db.scheduleEvents.delete(id);
    return true;
  }
};
