
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentData } from "@/types/students";
import { toast } from "sonner";

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: StudentData;
  onSave: (student: Omit<StudentData, "id">) => void;
  title: string;
}

export const StudentDialog = ({ open, onOpenChange, student, onSave, title }: StudentDialogProps) => {
  const [name, setName] = useState(student?.name || "");
  const [age, setAge] = useState(student?.age?.toString() || "");
  const [classRoom, setClassRoom] = useState(student?.class || "");
  const [email, setEmail] = useState(student?.email || "");
  const [attendance, setAttendance] = useState(student?.attendance?.toString() || "100");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age || !classRoom || !email || !attendance) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    const ageNum = parseInt(age);
    const attendanceNum = parseInt(attendance);

    if (isNaN(ageNum) || ageNum <= 0) {
      toast.error("L'âge doit être un nombre positif");
      return;
    }

    if (isNaN(attendanceNum) || attendanceNum < 0 || attendanceNum > 100) {
      toast.error("L'assiduité doit être un pourcentage entre 0 et 100");
      return;
    }

    onSave({
      name,
      age: ageNum,
      class: classRoom,
      email,
      attendance: attendanceNum
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom complet de l'étudiant" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age">Âge</Label>
            <Input 
              id="age" 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
              min="1"
              max="100" 
              placeholder="Âge de l'étudiant" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="class">Classe</Label>
            <Input 
              id="class" 
              value={classRoom} 
              onChange={(e) => setClassRoom(e.target.value)}
              placeholder="Classe de l'étudiant" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email de l'étudiant" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="attendance">Assiduité (%)</Label>
            <Input 
              id="attendance" 
              type="number" 
              value={attendance} 
              onChange={(e) => setAttendance(e.target.value)}
              min="0"
              max="100" 
              placeholder="Pourcentage d'assiduité" 
            />
          </div>
          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
