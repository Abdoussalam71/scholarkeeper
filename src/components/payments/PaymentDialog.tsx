
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { useStudentsData } from "@/hooks/useStudentsData";
import { useFeesData } from "@/hooks/useFeesData";
import { PaymentReceipt } from "@/types/fees";
import { useStudentPayments } from "@/hooks/useStudentPayments";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: PaymentReceipt;
  onSave: (payment: Omit<PaymentReceipt, "id" | "receiptNumber" | "transactionId">) => void;
  title: string;
}

export const PaymentDialog = ({ open, onOpenChange, payment, onSave, title }: PaymentDialogProps) => {
  const { students } = useStudentsData();
  const { classFees, paymentPlans } = useFeesData();

  const [studentId, setStudentId] = useState(payment?.studentId || "");
  const [studentName, setStudentName] = useState(payment?.studentName || "");
  const [className, setClassName] = useState(payment?.className || "");
  const [amount, setAmount] = useState(payment?.amount?.toString() || "");
  const [discountPercentage, setDiscountPercentage] = useState(payment?.discountPercentage || 0);
  const [originalAmount, setOriginalAmount] = useState(payment?.originalAmount || 0);
  const [finalAmount, setFinalAmount] = useState(payment?.finalAmount || 0);
  const [status, setStatus] = useState<PaymentReceipt["status"]>(payment?.status || "en attente");
  const [method, setMethod] = useState(payment?.paymentMethod || "espèces");
  const [date, setDate] = useState(payment?.paymentDate || new Date().toISOString().split('T')[0]);
  const [academicYear, setAcademicYear] = useState(payment?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
  const [remainingBalance, setRemainingBalance] = useState(payment?.remainingBalance || 0);
  const [totalFeesAmount, setTotalFeesAmount] = useState(0);
  const [isFullPayment, setIsFullPayment] = useState(false);

  // État pour suivre les frais de la classe sélectionnée
  const [selectedClassFees, setSelectedClassFees] = useState<any>(null);

  // Obtenir les paiements précédents de l'étudiant (si un étudiant est sélectionné)
  const { studentPayments, totalPaid, totalDue } = useStudentPayments(studentId);
  
  // Réinitialiser les valeurs à l'ouverture de la boîte de dialogue
  useEffect(() => {
    if (open) {
      setStudentId(payment?.studentId || "");
      setStudentName(payment?.studentName || "");
      setClassName(payment?.className || "");
      setAmount(payment?.amount?.toString() || "");
      setDiscountPercentage(payment?.discountPercentage || 0);
      setOriginalAmount(payment?.originalAmount || 0);
      setFinalAmount(payment?.finalAmount || 0);
      setStatus(payment?.status || "en attente");
      setMethod(payment?.paymentMethod || "espèces");
      setDate(payment?.paymentDate || new Date().toISOString().split('T')[0]);
      setAcademicYear(payment?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`);
      setRemainingBalance(payment?.remainingBalance || 0);
      setSelectedClassFees(null);
      setTotalFeesAmount(0);
      setIsFullPayment(false);
    }
  }, [open, payment]);

  // Mettre à jour les informations de l'étudiant
  useEffect(() => {
    if (studentId) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        setStudentName(student.name);
        setClassName(student.class);
        
        // Trouver les frais pour la classe de l'étudiant
        const fees = classFees.find(f => f.className === student.class);
        if (fees) {
          setSelectedClassFees(fees);
          setOriginalAmount(fees.yearlyAmount);
          setTotalFeesAmount(fees.yearlyAmount);
        }
      }
    }
  }, [studentId, students, classFees]);

  // Mettre à jour le solde restant lorsque le montant change
  useEffect(() => {
    if (!studentId || !totalFeesAmount) return;
    
    const amountNum = parseFloat(amount.replace(/\s/g, "")) || 0;
    
    // Calculer le montant total dû avec réduction
    const discountAmount = totalFeesAmount * (discountPercentage / 100);
    const discountedTotal = totalFeesAmount - discountAmount;
    
    // Calculer le solde restant après ce paiement
    const newRemainingBalance = Math.max(0, discountedTotal - (totalPaid + amountNum));
    setRemainingBalance(newRemainingBalance);
    setIsFullPayment(newRemainingBalance === 0);
    
    // Mettre à jour le montant final
    setFinalAmount(discountedTotal);
  }, [amount, totalFeesAmount, totalPaid, discountPercentage, studentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentId || !amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const amountNum = parseFloat(amount.replace(/\s/g, ""));

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Le montant doit être un nombre positif");
      return;
    }

    const student = students.find(s => s.id === studentId);
    
    if (!student) {
      toast.error("Étudiant introuvable");
      return;
    }

    // Obtenir le plan de paiement flexible
    const flexiblePlan = paymentPlans.find(p => p.name === "Paiement flexible") || { id: "plan-flexible" };

    onSave({
      studentId,
      studentName: student.name,
      className: student.class,
      amount: amountNum,
      originalAmount: totalFeesAmount,
      discountPercentage,
      finalAmount,
      status,
      paymentDate: date,
      paymentMethod: method,
      academicYear,
      paymentPlanId: flexiblePlan.id,
      remainingBalance,
      isFullPayment
    });

    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('fr-FR') + ' FCFA';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair">{title}</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour enregistrer un paiement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="student">Étudiant</Label>
            <Select value={studentId} onValueChange={setStudentId} defaultValue="">
              <SelectTrigger id="student">
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {studentId && studentPayments.length > 0 && (
            <div className="grid gap-2 bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total déjà payé:</span>
                <span>{formatCurrency(totalPaid)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Reste à payer:</span>
                <span>{formatCurrency(totalDue)}</span>
              </div>
            </div>
          )}
          
          {selectedClassFees && (
            <div className="grid gap-2 bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Frais annuels:</span>
                <span>{formatCurrency(selectedClassFees.yearlyAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Frais d'inscription:</span>
                <span>{formatCurrency(selectedClassFees.registrationFee)}</span>
              </div>
            </div>
          )}
          
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
              <span>{formatCurrency(totalFeesAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Réduction:</span>
              <span>-{formatCurrency((totalFeesAmount * discountPercentage) / 100)}</span>
            </div>
            <div className="flex justify-between items-center font-semibold">
              <span>Montant final:</span>
              <span>{formatCurrency(finalAmount)}</span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Montant à payer (FCFA)</Label>
            <Input 
              id="amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant en FCFA" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select value={method} onValueChange={setMethod} defaultValue="espèces">
              <SelectTrigger id="method">
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carte bancaire">Carte bancaire</SelectItem>
                <SelectItem value="espèces">Espèces</SelectItem>
                <SelectItem value="virement">Virement</SelectItem>
                <SelectItem value="chèque">Chèque</SelectItem>
                <SelectItem value="mobile money">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as PaymentReceipt["status"])}
              defaultValue="en attente"
            >
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
          
          <div className="grid gap-2">
            <Label htmlFor="academicYear">Année académique</Label>
            <Input 
              id="academicYear" 
              value={academicYear} 
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="ex: 2023-2024" 
            />
          </div>
          
          <div className="grid gap-2 bg-amber-50 p-3 rounded-md border border-amber-200">
            <div className="flex justify-between items-center font-semibold">
              <span>Solde restant après ce paiement:</span>
              <span className={remainingBalance === 0 ? "text-green-600" : "text-amber-600"}>
                {formatCurrency(remainingBalance)}
              </span>
            </div>
            {remainingBalance === 0 && (
              <p className="text-sm text-green-600">Ce paiement soldera le compte de l'étudiant.</p>
            )}
          </div>
          
          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
