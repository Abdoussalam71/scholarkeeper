
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTeachersData } from "@/hooks/useTeachersData";
import { useClassesData } from "@/hooks/useClassesData";
import { Course } from "@/types/courses";

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
  onSave: (course: Omit<Course, "id">) => void;
  title: string;
}

export const CourseDialog = ({ open, onOpenChange, course, onSave, title }: CourseDialogProps) => {
  const { teachers } = useTeachersData();
  const { classes } = useClassesData();
  
  const [name, setName] = useState(course?.name || "");
  const [description, setDescription] = useState(course?.description || "");
  const [teacherId, setTeacherId] = useState(course?.teacherId || "");
  const [teacherName, setTeacherName] = useState(course?.teacherName || "");
  const [classId, setClassId] = useState(course?.classId || "");
  const [className, setClassName] = useState(course?.className || "");
  const [schedule, setSchedule] = useState(course?.schedule || "");
  const [duration, setDuration] = useState(course?.duration || "");
  const [maxStudents, setMaxStudents] = useState(course?.maxStudents?.toString() || "");
  const [currentStudents, setCurrentStudents] = useState(course?.currentStudents?.toString() || "0");
  const [academicYear, setAcademicYear] = useState(course?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
  const [status, setStatus] = useState<Course["status"]>(course?.status || "active");
  
  // Réinitialiser les valeurs à l'ouverture de la boîte de dialogue
  useEffect(() => {
    if (open) {
      setName(course?.name || "");
      setDescription(course?.description || "");
      setTeacherId(course?.teacherId || "");
      setTeacherName(course?.teacherName || "");
      setClassId(course?.classId || "");
      setClassName(course?.className || "");
      setSchedule(course?.schedule || "");
      setDuration(course?.duration || "");
      setMaxStudents(course?.maxStudents?.toString() || "");
      setCurrentStudents(course?.currentStudents?.toString() || "0");
      setAcademicYear(course?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
      setStatus(course?.status || "active");
    }
  }, [open, course]);
  
  // Mettre à jour le nom de l'enseignant lorsque l'ID de l'enseignant change
  useEffect(() => {
    if (teacherId) {
      const teacher = teachers.find(t => t.id === teacherId);
      if (teacher) {
        setTeacherName(teacher.name);
      }
    }
  }, [teacherId, teachers]);
  
  // Mettre à jour le nom de la classe lorsque l'ID de la classe change
  useEffect(() => {
    if (classId) {
      const classObj = classes.find(c => c.id === classId);
      if (classObj) {
        setClassName(classObj.name);
      }
    } else {
      setClassName("");
    }
  }, [classId, classes]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !teacherId || !schedule || !duration || !maxStudents) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const maxStudentsNum = parseInt(maxStudents);
    const currentStudentsNum = parseInt(currentStudents || "0");
    
    if (isNaN(maxStudentsNum) || maxStudentsNum <= 0) {
      toast.error("Le nombre maximum d'étudiants doit être un nombre positif");
      return;
    }
    
    if (isNaN(currentStudentsNum) || currentStudentsNum < 0) {
      toast.error("Le nombre actuel d'étudiants doit être un nombre positif ou zéro");
      return;
    }
    
    onSave({
      name,
      description,
      teacherId,
      teacherName,
      classId,
      className,
      schedule,
      duration,
      maxStudents: maxStudentsNum,
      currentStudents: currentStudentsNum,
      academicYear,
      status
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair">{title}</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour enregistrer un cours
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du cours</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom du cours" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du cours" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="teacher">Enseignant</Label>
            <Select value={teacherId} onValueChange={setTeacherId}>
              <SelectTrigger id="teacher">
                <SelectValue placeholder="Sélectionner un enseignant" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="class">Classe (optionnel)</Label>
            <Select value={classId || ""} onValueChange={setClassId}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none_">Aucune classe</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="schedule">Horaire</Label>
            <Input 
              id="schedule" 
              value={schedule} 
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="ex: Lundi et Mercredi, 10:00-12:00" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="duration">Durée</Label>
            <Input 
              id="duration" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ex: 2h" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="maxStudents">Nombre max d'étudiants</Label>
              <Input 
                id="maxStudents" 
                type="number" 
                value={maxStudents} 
                onChange={(e) => setMaxStudents(e.target.value)}
                placeholder="ex: 30" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="currentStudents">Nombre actuel d'étudiants</Label>
              <Input 
                id="currentStudents" 
                type="number" 
                value={currentStudents} 
                onChange={(e) => setCurrentStudents(e.target.value)}
                placeholder="ex: 0" 
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="academicYear">Année académique</Label>
            <Input 
              id="academicYear" 
              value={academicYear} 
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="ex: 2023-2024" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as Course["status"])}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
