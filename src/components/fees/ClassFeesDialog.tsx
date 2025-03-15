
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useClassesData } from "@/hooks/useClassesData";
import { ClassFees } from "@/types/fees";

interface ClassFeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classFees?: ClassFees;
  onSave: (classFees: Omit<ClassFees, "id" | "termAmount">) => void;
  title: string;
}

export const ClassFeesDialog = ({ open, onOpenChange, classFees, onSave, title }: ClassFeesDialogProps) => {
  const [classId, setClassId] = useState(classFees?.classId || "");
  const [yearlyAmount, setYearlyAmount] = useState(classFees?.yearlyAmount?.toString() || "");
  const [registrationFee, setRegistrationFee] = useState(classFees?.registrationFee?.toString() || "0");
  const [academicYear, setAcademicYear] = useState(classFees?.academicYear || new Date().getFullYear().toString());
  const [termAmount, setTermAmount] = useState("0");
  const [className, setClassName] = useState(classFees?.className || "");
  
  // Récupérer la liste des classes disponibles
  const { classes } = useClassesData();

  // Calculer automatiquement le montant par trimestre
  useEffect(() => {
    const yearly = parseFloat(yearlyAmount) || 0;
    setTermAmount(Math.ceil(yearly / 3).toLocaleString('fr-FR'));
  }, [yearlyAmount]);

  // Mettre à jour les valeurs lors de l'ouverture de la boîte de dialogue
  useEffect(() => {
    if (open) {
      setClassId(classFees?.classId || "");
      setYearlyAmount(classFees?.yearlyAmount?.toString() || "");
      setRegistrationFee(classFees?.registrationFee?.toString() || "0");
      setAcademicYear(classFees?.academicYear || new Date().getFullYear().toString());
      setClassName(classFees?.className || "");
    }
  }, [open, classFees]);

  // Mettre à jour le nom de la classe lorsque l'ID de la classe change
  useEffect(() => {
    if (classId) {
      const selectedClass = classes.find(c => c.id === classId);
      if (selectedClass) {
        setClassName(selectedClass.name);
      }
    }
  }, [classId, classes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classId || !yearlyAmount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const yearlyAmountNum = parseFloat(yearlyAmount.replace(/\s/g, ""));
    const registrationFeeNum = parseFloat(registrationFee.replace(/\s/g, ""));

    if (isNaN(yearlyAmountNum) || yearlyAmountNum < 0) {
      toast.error("Le montant annuel doit être un nombre positif");
      return;
    }

    if (isNaN(registrationFeeNum) || registrationFeeNum < 0) {
      toast.error("Les frais d'inscription doivent être un nombre positif");
      return;
    }

    onSave({
      classId,
      className,
      yearlyAmount: yearlyAmountNum,
      registrationFee: registrationFeeNum,
      academicYear
    });

    onOpenChange(false);
  };

  const formatAmount = (value: string): string => {
    // Supprimer tous les espaces et les caractères non numériques sauf le point décimal
    const numericValue = value.replace(/[^\d.]/g, "");
    // Convertir en nombre et formater avec des espaces pour les milliers
    const formattedValue = parseFloat(numericValue) || 0;
    return formattedValue.toLocaleString('fr-FR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-playfair">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="class">Classe</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="yearlyAmount">Frais annuels (FCFA)</Label>
            <Input 
              id="yearlyAmount" 
              value={yearlyAmount} 
              onChange={(e) => setYearlyAmount(formatAmount(e.target.value))}
              placeholder="Montant annuel (FCFA)" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="registrationFee">Frais d'inscription (FCFA)</Label>
            <Input 
              id="registrationFee" 
              value={registrationFee} 
              onChange={(e) => setRegistrationFee(formatAmount(e.target.value))}
              placeholder="Frais d'inscription (FCFA)" 
            />
          </div>
          
          <div className="grid gap-2 bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Montant par trimestre:</span>
              <span>{termAmount} FCFA</span>
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
          
          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
