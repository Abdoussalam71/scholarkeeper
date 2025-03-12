
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeacherData } from "@/types/teachers";
import { toast } from "sonner";

interface TeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: TeacherData;
  onSave: (teacher: Omit<TeacherData, "id">) => void;
  title: string;
}

export const TeacherDialog = ({ open, onOpenChange, teacher, onSave, title }: TeacherDialogProps) => {
  const [name, setName] = useState(teacher?.name || "");
  const [subject, setSubject] = useState(teacher?.subject || "");
  const [email, setEmail] = useState(teacher?.email || "");
  const [phone, setPhone] = useState(teacher?.phone || "");
  const [availability, setAvailability] = useState(teacher?.availability || "");
  const [hireDate, setHireDate] = useState(teacher?.hireDate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !subject || !email || !phone || !availability || !hireDate) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    onSave({
      name,
      subject,
      email,
      phone,
      availability,
      hireDate
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
              placeholder="Nom complet de l'enseignant" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Matière</Label>
            <Input 
              id="subject" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Matière enseignée" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email de l'enseignant" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numéro de téléphone" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="availability">Disponibilité</Label>
            <Input 
              id="availability" 
              value={availability} 
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Ex: Lundi, Mardi, Jeudi" 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hireDate">Date d'embauche</Label>
            <Input 
              id="hireDate" 
              value={hireDate} 
              onChange={(e) => setHireDate(e.target.value)}
              placeholder="Ex: 01/09/2020" 
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
