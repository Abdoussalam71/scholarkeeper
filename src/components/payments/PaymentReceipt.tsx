
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentReceipt as PaymentReceiptType } from "@/types/fees";
import { useSchoolInfoStore } from "@/stores/schoolInfoStore";
import { Download, Printer } from "lucide-react";
import { format } from "date-fns";

interface PaymentReceiptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: PaymentReceiptType;
}

export const PaymentReceipt = ({ open, onOpenChange, receipt }: PaymentReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { schoolInfo } = useSchoolInfoStore();
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('fr-FR') + ' FCFA';
  };
  
  const handlePrint = () => {
    if (receiptRef.current) {
      const printContents = receiptRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Reçu de Paiement - ${receipt.receiptNumber}</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                .receipt { max-width: 800px; margin: 0 auto; padding: 20px; }
                .receipt-header { text-align: center; margin-bottom: 20px; }
                .school-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                .receipt-title { font-size: 20px; margin: 20px 0; text-align: center; }
                .receipt-number { font-size: 16px; text-align: right; margin-bottom: 20px; }
                .transaction-id { font-size: 14px; color: #666; }
                .receipt-section { margin-bottom: 20px; }
                .receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .receipt-label { font-weight: bold; }
                .receipt-data { text-align: right; }
                .receipt-total { border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px; font-weight: bold; }
                .receipt-footer { margin-top: 40px; text-align: center; font-size: 14px; color: #666; }
                .payment-complete { display: inline-block; margin-top: 10px; background: #d1fae5; color: #065f46; padding: 5px 10px; border-radius: 4px; font-weight: bold; }
              </style>
            </head>
            <body>
              ${printContents}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => printWindow.close();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair">Reçu de Paiement</DialogTitle>
        </DialogHeader>
        
        <div ref={receiptRef} className="receipt bg-white p-6 rounded-lg border">
          <div className="receipt-header">
            <div className="school-name">{schoolInfo?.name}</div>
            <div>{schoolInfo?.address}</div>
            <div>{schoolInfo?.phone} - {schoolInfo?.email}</div>
          </div>
          
          <div className="receipt-title font-bold text-xl">REÇU DE PAIEMENT</div>
          
          <div className="receipt-number">
            <div className="font-bold">N° {receipt.receiptNumber}</div>
            <div className="transaction-id text-sm text-gray-500">Transaction ID: {receipt.transactionId}</div>
            <div className="text-sm">Date: {format(new Date(receipt.paymentDate), 'dd/MM/yyyy HH:mm')}</div>
          </div>
          
          <div className="receipt-section border-t pt-4">
            <h3 className="font-bold text-lg mb-2">Information étudiant</h3>
            <div className="receipt-row">
              <span className="receipt-label">Nom:</span>
              <span className="receipt-data">{receipt.studentName}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Classe:</span>
              <span className="receipt-data">{receipt.className}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Année académique:</span>
              <span className="receipt-data">{receipt.academicYear}</span>
            </div>
          </div>
          
          <div className="receipt-section border-t pt-4">
            <h3 className="font-bold text-lg mb-2">Détails du paiement</h3>
            <div className="receipt-row">
              <span className="receipt-label">Montant initial:</span>
              <span className="receipt-data">{formatCurrency(receipt.originalAmount)}</span>
            </div>
            {receipt.discountPercentage > 0 && (
              <div className="receipt-row">
                <span className="receipt-label">Réduction ({receipt.discountPercentage}%):</span>
                <span className="receipt-data text-red-600">
                  -{formatCurrency(receipt.originalAmount - receipt.finalAmount)}
                </span>
              </div>
            )}
            <div className="receipt-row receipt-total">
              <span className="receipt-label">Montant payé:</span>
              <span className="receipt-data">{formatCurrency(receipt.amount)}</span>
            </div>
            
            {receipt.remainingBalance > 0 ? (
              <div className="receipt-row mt-2">
                <span className="receipt-label">Solde restant:</span>
                <span className="receipt-data text-amber-600">{formatCurrency(receipt.remainingBalance)}</span>
              </div>
            ) : (
              receipt.isFullPayment && (
                <div className="text-center mt-4">
                  <span className="payment-complete">Compte soldé</span>
                </div>
              )
            )}
          </div>
          
          <div className="receipt-section border-t pt-4">
            <h3 className="font-bold text-lg mb-2">Méthode de paiement</h3>
            <div className="receipt-row">
              <span className="receipt-label">Mode de paiement:</span>
              <span className="receipt-data capitalize">{receipt.paymentMethod}</span>
            </div>
            {receipt.termNumber && (
              <div className="receipt-row">
                <span className="receipt-label">Trimestre:</span>
                <span className="receipt-data">{receipt.termNumber}</span>
              </div>
            )}
            <div className="receipt-row">
              <span className="receipt-label">Statut:</span>
              <span className={`receipt-data capitalize font-medium ${
                receipt.status === "payé" ? "text-green-600" : 
                receipt.status === "en attente" ? "text-amber-600" : "text-red-600"
              }`}>
                {receipt.status}
              </span>
            </div>
          </div>
          
          <div className="receipt-footer mt-8 text-center text-gray-500">
            <p>Merci pour votre paiement</p>
            <p>Ce reçu est généré électroniquement et ne nécessite pas de signature</p>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
