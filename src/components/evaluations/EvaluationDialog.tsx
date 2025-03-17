
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Evaluation } from "@/types/evaluations";
import { ClassData } from "@/types/classes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const evaluationSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  courseId: z.string().min(1, "Le cours est requis"),
  courseName: z.string().min(1, "Le nom du cours est requis"),
  teacherName: z.string().min(1, "L'enseignant est requis"),
  classId: z.string().min(1, "La classe est requise"),
  className: z.string().min(1, "Le nom de la classe est requis"),
  date: z.date({
    required_error: "La date est requise",
  }),
  startTime: z.string().min(1, "L'heure de début est requise"),
  endTime: z.string().min(1, "L'heure de fin est requise"),
  room: z.string().min(1, "La salle est requise"),
  duration: z.coerce.number().min(10, "La durée minimale est de 10 minutes"),
  totalPoints: z.coerce.number().min(1, "Le nombre de points doit être au moins 1"),
  status: z.enum(["planned", "completed", "cancelled"]),
  notes: z.string().optional(),
});

interface EvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation?: Evaluation;
  onSave: (evaluation: Omit<Evaluation, "id">) => void;
  title: string;
  classes: ClassData[];
  courses: { id: string; name: string; teacherName: string }[];
}

export const EvaluationDialog = ({
  open,
  onOpenChange,
  evaluation,
  onSave,
  title,
  classes,
  courses
}: EvaluationDialogProps) => {
  const isEditing = !!evaluation;
  
  const form = useForm<z.infer<typeof evaluationSchema>>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      title: evaluation?.title || "",
      courseId: evaluation?.courseId || "",
      courseName: evaluation?.courseName || "",
      teacherName: evaluation?.teacherName || "",
      classId: evaluation?.classId || "",
      className: evaluation?.className || "",
      date: evaluation?.date ? new Date(evaluation.date) : new Date(),
      startTime: evaluation?.startTime || "09:00",
      endTime: evaluation?.endTime || "10:30",
      room: evaluation?.room || "",
      duration: evaluation?.duration || 90,
      totalPoints: evaluation?.totalPoints || 20,
      status: evaluation?.status || "planned",
      notes: evaluation?.notes || "",
    }
  });
  
  useEffect(() => {
    if (open && evaluation) {
      form.reset({
        title: evaluation.title,
        courseId: evaluation.courseId,
        courseName: evaluation.courseName,
        teacherName: evaluation.teacherName,
        classId: evaluation.classId,
        className: evaluation.className,
        date: new Date(evaluation.date),
        startTime: evaluation.startTime,
        endTime: evaluation.endTime,
        room: evaluation.room,
        duration: evaluation.duration,
        totalPoints: evaluation.totalPoints,
        status: evaluation.status,
        notes: evaluation.notes || "",
      });
    } else if (open) {
      form.reset({
        title: "",
        courseId: "",
        courseName: "",
        teacherName: "",
        classId: "",
        className: "",
        date: new Date(),
        startTime: "09:00",
        endTime: "10:30",
        room: "",
        duration: 90,
        totalPoints: 20,
        status: "planned",
        notes: "",
      });
    }
  }, [open, evaluation, form]);
  
  const onSubmit = (data: z.infer<typeof evaluationSchema>) => {
    const submissionData: Omit<Evaluation, "id"> = {
      title: data.title,
      courseId: data.courseId,
      courseName: data.courseName,
      teacherName: data.teacherName,
      classId: data.classId,
      className: data.className,
      date: format(data.date, 'yyyy-MM-dd'),
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room,
      duration: data.duration,
      totalPoints: data.totalPoints,
      status: data.status,
      notes: data.notes
    };
    
    onSave(submissionData);
    onOpenChange(false);
  };
  
  const handleCourseChange = (courseId: string) => {
    const selectedCourse = courses.find(course => course.id === courseId);
    if (selectedCourse) {
      form.setValue("courseName", selectedCourse.name);
      form.setValue("teacherName", selectedCourse.teacherName);
    }
  };
  
  const handleClassChange = (classId: string) => {
    const selectedClass = classes.find(classItem => classItem.id === classId);
    if (selectedClass) {
      form.setValue("className", selectedClass.name);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l'évaluation</FormLabel>
                  <FormControl>
                    <Input placeholder="Examen final, Contrôle continu, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
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
              
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleClassChange(value);
                      }} 
                      defaultValue={field.value}
                    >
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Durée (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="totalPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points totaux</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="planned">Planifiée</SelectItem>
                      <SelectItem value="completed">Terminée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes / Instructions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Chapitres à réviser, matériel autorisé, etc."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">{isEditing ? "Mettre à jour" : "Créer l'évaluation"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
