
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { useStudentsData } from "@/hooks/useStudentsData";

export interface PaymentData {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  discountPercentage: number;
  finalAmount: number;
  status: "payé" | "en attente" | "retard";
  date: string;
  method: "carte bancaire" | "espèces" | "virement" | "chèque";
  category: "frais de scolarité" | "activité extrascolaire" | "cantine" | "transport";
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: PaymentData;
  onSave: (payment: Omit<PaymentData, "id">) => void;
  title: string;
}

export const PaymentDialog = ({ open, onOpenChange, payment, onSave, title }: PaymentDialogProps) => {
  const { students } = useStudentsData();

  const [studentId, setStudentId] = useState(payment?.studentId || "");
  const [amount, setAmount] = useState(payment?.amount?.toString() || "");
  const [discountPercentage, setDiscountPercentage] = useState(payment?.discountPercentage || 0);
  const [finalAmount, setFinalAmount] = useState(payment?.finalAmount || 0);
  const [status, setStatus] = useState<PaymentData["status"]>(payment?.status || "en attente");
  const [method, setMethod] = useState<PaymentData["method"]>(payment?.method || "espèces");
  const [category, setCategory] = useState<PaymentData["category"]>(payment?.category || "frais de scolarité");
  const [date, setDate] = useState(payment?.date || new Date().toISOString().split('T')[0]);

  // Calculer le montant final après réduction
  useEffect(() => {
    const baseAmount = parseFloat(amount) || 0;
    const discount = baseAmount * (discountPercentage / 100);
    setFinalAmount(baseAmount - discount);
  }, [amount, discountPercentage]);

  // Réinitialiser les valeurs à l'ouverture de la boîte de dialogue
  useEffect(() => {
    if (open) {
      setStudentId(payment?.studentId || "");
      setAmount(payment?.amount?.toString() || "");
      setDiscountPercentage(payment?.discountPercentage || 0);
      setStatus(payment?.status || "en attente");
      setMethod(payment?.method || "espèces");
      setCategory(payment?.category || "frais de scolarité");
      setDate(payment?.date || new Date().toISOString().split('T')[0]);
    }
  }, [open, payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Le montant doit être un nombre positif");
      return;
    }

    const student = students.find(s => s.id === studentId);
    
    if (!student) {
      toast.error("Étudiant introuvable");
      return;
    }

    onSave({
      studentId,
      studentName: student.name,
      amount: amountNum,
      discountPercentage,
      finalAmount,
      status,
      date,
      method,
      category
    });

    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('fr-FR') + ' FCFA';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-playfair">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="student">Étudiant</Label>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger id="student">
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Montant (FCFA)</Label>
            <Input 
              id="amount" 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              placeholder="Montant en FCFA" 
            />
          </div>
          
          <div className="grid gap-2">
            <div className="flex justify-between">
              <Label htmlFor="discount">Réduction (%)</Label>
              <span className="text-sm text-muted-foreground">{discountPercentage}%</span>
            </div>
            <Slider
              id="discount"
              min={0}
              max={100}
              step={1}
              value={[discountPercentage]}
              onValueChange={(values) => setDiscountPercentage(values[0])}
              className="py-4"
            />
          </div>
          
          <div className="grid gap-2 bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Montant original:</span>
              <span>{formatCurrency(parseFloat(amount) || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Réduction:</span>
              <span>-{formatCurrency(((parseFloat(amount) || 0) * discountPercentage) / 100)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span>Montant final:</span>
              <span>{formatCurrency(finalAmount)}</span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as PaymentData["category"])}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frais de scolarité">Frais de scolarité</SelectItem>
                <SelectItem value="activité extrascolaire">Activité extrascolaire</SelectItem>
                <SelectItem value="cantine">Cantine</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select value={method} onValueChange={(value) => setMethod(value as PaymentData["method"])}>
              <SelectTrigger id="method">
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carte bancaire">Carte bancaire</SelectItem>
                <SelectItem value="espèces">Espèces</SelectItem>
                <SelectItem value="virement">Virement</SelectItem>
                <SelectItem value="chèque">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as PaymentData["status"])}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payé">Payé</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
                <SelectItem value="retard">En retard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
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
