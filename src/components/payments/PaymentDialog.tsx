
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { useStudentsData } from "@/hooks/useStudentsData";
import { useFeesData } from "@/hooks/useFeesData";
import { PaymentReceipt } from "@/types/fees";

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
  const [paymentPlanId, setPaymentPlanId] = useState(payment?.paymentPlanId || "plan-1");
  const [termNumber, setTermNumber] = useState(payment?.termNumber?.toString() || "");
  const [remainingBalance, setRemainingBalance] = useState(payment?.remainingBalance || 0);

  // État pour suivre les frais de la classe sélectionnée
  const [selectedClassFees, setSelectedClassFees] = useState<any>(null);

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
      setPaymentPlanId(payment?.paymentPlanId || "plan-1");
      setTermNumber(payment?.termNumber?.toString() || "");
      setRemainingBalance(payment?.remainingBalance || 0);
      setSelectedClassFees(null);
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
          
          // Définir le montant en fonction du plan de paiement
          const plan = paymentPlans.find(p => p.id === paymentPlanId);
          if (plan) {
            if (plan.instalments === 1) {
              // Paiement intégral
              setOriginalAmount(fees.yearlyAmount);
            } else if (plan.instalments === 3) {
              // Paiement trimestriel
              setOriginalAmount(fees.termAmount);
            }
          }
        }
      }
    }
  }, [studentId, students, classFees, paymentPlanId, paymentPlans]);

  // Mettre à jour le montant final en fonction de la réduction
  useEffect(() => {
    const discountAmount = originalAmount * (discountPercentage / 100);
    const final = originalAmount - discountAmount;
    setFinalAmount(final);
    
    // Si c'est un paiement intégral, le montant est le montant final
    const plan = paymentPlans.find(p => p.id === paymentPlanId);
    if (plan?.instalments === 1) {
      setAmount(final.toString());
      setRemainingBalance(0);
    } else if (plan?.instalments === 3) {
      // Pour un paiement trimestriel, le montant par défaut est le montant du trimestre
      setAmount(final.toString());
      
      // Calculer le solde restant (pour les trimestres suivants)
      if (selectedClassFees) {
        const termCount = parseInt(termNumber || "1");
        const termsRemaining = 3 - termCount;
        if (termsRemaining > 0) {
          setRemainingBalance(selectedClassFees.termAmount * termsRemaining);
        } else {
          setRemainingBalance(0);
        }
      }
    }
  }, [originalAmount, discountPercentage, paymentPlanId, termNumber, paymentPlans, selectedClassFees]);

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

    // Vérifier le plan de paiement
    const selectedPlan = paymentPlans.find(p => p.id === paymentPlanId);
    if (!selectedPlan) {
      toast.error("Plan de paiement invalide");
      return;
    }

    // Vérifier le numéro de trimestre pour les paiements trimestriels
    if (selectedPlan.instalments === 3 && (!termNumber || parseInt(termNumber) < 1 || parseInt(termNumber) > 3)) {
      toast.error("Veuillez sélectionner un trimestre valide (1, 2 ou 3)");
      return;
    }

    onSave({
      studentId,
      studentName: student.name,
      className: student.class,
      amount: amountNum,
      originalAmount,
      discountPercentage,
      finalAmount,
      status,
      paymentDate: date,
      paymentMethod: method,
      academicYear,
      paymentPlanId,
      termNumber: termNumber ? parseInt(termNumber) : undefined,
      remainingBalance
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
                    {student.name} - {student.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="paymentPlan">Plan de paiement</Label>
            <Select value={paymentPlanId} onValueChange={setPaymentPlanId}>
              <SelectTrigger id="paymentPlan">
                <SelectValue placeholder="Sélectionner un plan" />
              </SelectTrigger>
              <SelectContent>
                {paymentPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - {plan.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {paymentPlanId === "plan-2" && (
            <div className="grid gap-2">
              <Label htmlFor="termNumber">Trimestre</Label>
              <Select value={termNumber} onValueChange={setTermNumber}>
                <SelectTrigger id="termNumber">
                  <SelectValue placeholder="Sélectionner un trimestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Trimestre 1</SelectItem>
                  <SelectItem value="2">Trimestre 2</SelectItem>
                  <SelectItem value="3">Trimestre 3</SelectItem>
                </SelectContent>
              </Select>
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
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Montant par trimestre:</span>
                <span>{formatCurrency(selectedClassFees.termAmount)}</span>
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
              <span>{formatCurrency(originalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Réduction:</span>
              <span>-{formatCurrency((originalAmount * discountPercentage) / 100)}</span>
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
            <Select value={method} onValueChange={setMethod}>
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
            <Select value={status} onValueChange={(value) => setStatus(value as PaymentReceipt["status"])}>
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
          
          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
