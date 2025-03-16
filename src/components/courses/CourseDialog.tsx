
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTeachersData } from "@/hooks/useTeachersData";
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
  
  const [name, setName] = useState(course?.name || "");
  const [description, setDescription] = useState(course?.description || "");
  const [teacherId, setTeacherId] = useState(course?.teacherId || "");
  const [teacherName, setTeacherName] = useState(course?.teacherName || "");
  const [status, setStatus] = useState<Course["status"]>(course?.status || "active");
  
  // Réinitialiser les valeurs à l'ouverture de la boîte de dialogue
  useEffect(() => {
    if (open) {
      setName(course?.name || "");
      setDescription(course?.description || "");
      setTeacherId(course?.teacherId || "");
      setTeacherName(course?.teacherName || "");
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !teacherId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Valeurs par défaut pour les champs supprimés
    const currentYear = new Date().getFullYear();
    const defaultAcademicYear = `${currentYear}-${currentYear + 1}`;
    
    onSave({
      name,
      description,
      teacherId,
      teacherName,
      classId: course?.classId || "",
      className: course?.className || "",
      schedule: course?.schedule || "",
      duration: course?.duration || "",
      maxStudents: course?.maxStudents || 30,
      currentStudents: course?.currentStudents || 0,
      academicYear: course?.academicYear || defaultAcademicYear,
      status
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-playfair">{title}</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour enregistrer une matière
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom de la matière</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de la matière" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la matière" 
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
