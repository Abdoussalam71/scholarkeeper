
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduleEvent } from "@/types/schedule";
import { ClassData } from "@/types/classes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const DAYS_OF_WEEK = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const scheduleEventSchema = z.object({
  courseId: z.string().min(1, "Le cours est requis"),
  courseName: z.string().min(1, "Le nom du cours est requis"),
  teacherName: z.string().min(1, "L'enseignant est requis"),
  dayOfWeek: z.string().min(1, "Le jour est requis"),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  room: z.string().min(1, "La salle est requise"),
  classId: z.string().optional(),
});

interface ScheduleEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: ScheduleEvent;
  onSave: (event: Omit<ScheduleEvent, "id">) => void;
  title: string;
  classes: ClassData[];
  courses: { id: string; name: string; teacherName: string }[];
}

export const ScheduleEventDialog = ({
  open,
  onOpenChange,
  event,
  onSave,
  title,
  classes,
  courses
}: ScheduleEventDialogProps) => {
  const isEditing = !!event;
  
  const form = useForm<z.infer<typeof scheduleEventSchema>>({
    resolver: zodResolver(scheduleEventSchema),
    defaultValues: {
      courseId: event?.courseId || "",
      courseName: event?.courseName || "",
      teacherName: event?.teacherName || "",
      dayOfWeek: event?.dayOfWeek || "Lundi",
      startTime: event?.startTime || "08:00",
      endTime: event?.endTime || "09:00",
      room: event?.room || "",
      classId: event?.classId || ""
    }
  });
  
  useEffect(() => {
    if (open && event) {
      form.reset({
        courseId: event.courseId,
        courseName: event.courseName,
        teacherName: event.teacherName,
        dayOfWeek: event.dayOfWeek,
        startTime: event.startTime,
        endTime: event.endTime,
        room: event.room,
        classId: event.classId
      });
    } else if (open) {
      form.reset({
        courseId: "",
        courseName: "",
        teacherName: "",
        dayOfWeek: "Lundi",
        startTime: "08:00",
        endTime: "09:00",
        room: "",
        classId: ""
      });
    }
  }, [open, event, form]);
  
  const onSubmit = (data: z.infer<typeof scheduleEventSchema>) => {
    const selectedCourse = courses.find(course => course.id === data.courseId);
    
    onSave({
      courseId: data.courseId,
      courseName: selectedCourse?.name || data.courseName,
      teacherName: selectedCourse?.teacherName || data.teacherName,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
      classId: data.classId
    });
    
    onOpenChange(false);
  };
  
  const handleCourseChange = (courseId: string) => {
    const selectedCourse = courses.find(course => course.id === courseId);
    if (selectedCourse) {
      form.setValue("courseName", selectedCourse.name);
      form.setValue("teacherName", selectedCourse.teacherName);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une classe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map(classItem => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name} ({classItem.level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cours</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCourseChange(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un cours" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} - {course.teacherName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jour</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Jour" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DAYS_OF_WEEK.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salle</FormLabel>
                    <FormControl>
                      <Input placeholder="Salle 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Début" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_SLOTS.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Fin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_SLOTS.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">{isEditing ? "Mettre à jour" : "Ajouter"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
